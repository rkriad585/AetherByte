/* 
   ================================================================
   GLOBAL VARIABLES
   ================================================================
*/
let currentBinary = ""; // Stores the compiled binary code
var myEditor;           // Stores the CodeMirror editor instance

/* 
   ================================================================
   BINARY EDIT MODE TOGGLE (IMPROVED)
   ================================================================
*/
let isBinaryEditing = false;

    /* 
   ================================================================
   APPLY USER SETTINGS (Layout, Fonts, Behavior)
   ================================================================
*/
function applyUserSettings() {
    // 1. LAYOUT
    const layout = localStorage.getItem('AetherLayout') || 'standard';
    const colEditor = $('#colEditor');
    const colBinary = $('#colBinary');
    const colTerminal = $('#colTerminal');

    if (layout === 'focus') {
        colBinary.addClass('hidden'); 
        colEditor.removeClass('lg:col-span-5').addClass('lg:col-span-8');
        colTerminal.removeClass('lg:col-span-4').addClass('lg:col-span-4');
    } else {
        colBinary.removeClass('hidden');
        colEditor.removeClass('lg:col-span-8').addClass('lg:col-span-5');
        colTerminal.removeClass('lg:col-span-4').addClass('lg:col-span-4');
    }
    
    // 2. EDITOR CONFIG (If Editor exists)
    if(myEditor) {
        // Font Size (Apply to the container)
        const fontSize = localStorage.getItem('AetherFontSize') || '14px';
        $('.CodeMirror').css('font-size', fontSize);

        // Line Wrapping
        const lineWrap = (localStorage.getItem('AetherLineWrap') === 'true');
        myEditor.setOption('lineWrapping', lineWrap);

        // Line Numbers
        // Default is true, so we check if it is explicitly 'false'
        const lineNums = (localStorage.getItem('AetherLineNumbers') !== 'false');
        myEditor.setOption('lineNumbers', lineNums);

        // Refresh to fix any spacing issues
        myEditor.refresh();
    }
}

function toggleBinaryEdit() {
    isBinaryEditing = !isBinaryEditing;
    
    const visualDiv = $('#binaryOutput');
    const editArea = $('#binaryEditor');
    const btn = $('#btnEditBinary'); // The Pencil Icon Button

    if (isBinaryEditing) {
        // --- ENTER EDIT MODE ---
        
        // 1. Fill textarea with current code (if any)
        if (currentBinary) {
            editArea.val(currentBinary);
        }

        // 2. Hide Visual, Show Textarea
        visualDiv.addClass('hidden');
        editArea.removeClass('hidden');

        // 3. Highlight the Edit Button (Red Glow)
        btn.addClass('text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(235,0,41,0.2)] border border-red-500/30');
        
    } else {
        // --- EXIT EDIT MODE ---

        // 1. Save changes from Textarea to Logic
        const manualCode = editArea.val().trim();
        
        if(manualCode) {
            currentBinary = manualCode;
            
            // 2. Re-render the visual display
            visualDiv.empty();
            const lines = currentBinary.split('\n');
            lines.forEach(line => {
                // Basic validation to keep styling consistent
                const opCode = line.substring(0, 8);
                const data = line.substring(8);
                const html = `<span class="bin-op">${opCode}</span><span class="bin-data">${data}</span>`;
                visualDiv.append(`<div class="mb-1 border-b border-white/5 pb-1 font-mono text-xs">${html}</div>`);
            });
        }

        // 3. Hide Textarea, Show Visual
        editArea.addClass('hidden');
        visualDiv.removeClass('hidden');

        // 4. Reset Button Style
        btn.removeClass('text-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(235,0,41,0.2)] border border-red-500/30');
    }
}

/* 
   ================================================================
   TERMINAL CLEAR FUNCTION
   ================================================================
*/
function clearTerminal() {
    // 1. Clear the content div
    $('#consoleContent').empty();
    
    // 2. Add a visual confirmation (Optional, looks cool)
    $('#consoleContent').append('<div class="text-gray-600 italic mb-2">> Terminal cleared.</div>');
}


/* 
   ================================================================
   SECTION 1: MODALS & DATABASE UI
   ================================================================
*/

// Close the file manager modal
function closeModal() {
    $('#fileModal').fadeOut(200);
}

// Open Save Modal
function openSaveModal() {
    $('#modalTitle').text('SAVE SCRIPT');
    $('#saveView').show(); 
    $('#loadView').hide();
    $('#scriptTitle').val(''); // Clear input
    $('#fileModal').css('display', 'flex').hide().fadeIn(200);
}

// Open Load Modal & Fetch Files
function openLoadModal() {
    $('#modalTitle').text('LOAD SCRIPT');
    $('#saveView').hide(); 
    $('#loadView').show();
    $('#fileModal').css('display', 'flex').hide().fadeIn(200);

    // Ask server for list of files
    $.get('/api/list', function(data) {
        const list = $('#fileList');
        list.empty();
        
        if (data.scripts.length === 0) {
            list.html('<div class="text-center text-gray-600 text-xs py-4">No saved scripts found.</div>');
            return;
        }

        // Create HTML for each file
        data.scripts.forEach(script => {
            list.append(`
                <div class="flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group cursor-pointer">
                    <div onclick="loadFile(${script.id})" class="flex-1">
                        <div class="text-sm font-bold text-gray-200">${script.title}</div>
                        <div class="text-[10px] text-gray-600 font-mono">${script.created_at}</div>
                    </div>
                    <button onclick="deleteFile(${script.id})" class="text-gray-600 hover:text-red-500 px-2 opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
            `);
        });
    });
}


/* 
   ================================================================
   SECTION 2: DATABASE ACTIONS (Save/Load/Delete)
   ================================================================
*/

// Save current code to DB
function commitSave() {
    const title = $('#scriptTitle').val();
    // CRITICAL: Get text from CodeMirror, not the hidden textarea
    const code = myEditor.getValue(); 
    
    if (!title) return alert("Please enter a name");

    $.ajax({
        url: '/api/save',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ title: title, code: code }),
        success: function() {
            closeModal();
            alert("Saved Successfully");
        },
        error: function() {
            alert("Save Failed");
        }
    });
}

// Load a specific file from DB into Editor
function loadFile(id) {
    $.get(`/api/load/${id}`, function(data) {
        if (data && data.code) {
            // CRITICAL: Use setValue to update the fancy editor
            myEditor.setValue(data.code);
            closeModal();
        } else {
            alert("Error: Could not load script content.");
        }
    });
}

// Delete a file
function deleteFile(id) {
    if (!confirm("Delete this script?")) return;
    $.ajax({
        url: `/api/delete/${id}`,
        type: 'DELETE',
        success: function() {
            openLoadModal(); // Refresh the list
        }
    });
}


/* 
   ================================================================
   SECTION 3: FILE I/O (Download & Upload)
   ================================================================
*/

// Download the code as a file
function downloadCode() {
    // Get text from CodeMirror
    const codeText = myEditor.getValue(); 

    if (!codeText.trim()) {
        alert("Editor is empty. Nothing to download.");
        return;
    }

    const blob = new Blob([codeText], { type: 'text/plain' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'Natural-Script.ns'; // .ns extension
    anchor.click();
    URL.revokeObjectURL(anchor.href);
}

// Master Upload Handler (Used by both Mobile & Desktop)
function handleUploadCommon(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        // Update CodeMirror with the file content
        myEditor.setValue(e.target.result);
        alert("File loaded into editor successfully!");
    };
    reader.readAsText(file);
}

// Wrapper for Desktop Nav Upload
function handleDesktopUpload(input) {
    handleUploadCommon(input.files[0]);
    input.value = ''; 
}

// Wrapper for Mobile Menu Upload
function handleFileUpload(input) {
    handleUploadCommon(input.files[0]);
    input.value = ''; 
    closeToolsModal(); 
}

// Helper: Open Mobile Tools Modal
function openToolsModal() {
    $('#toolsModal').removeClass('hidden').addClass('flex');
}
function closeToolsModal() {
    $('#toolsModal').removeClass('flex').addClass('hidden');
}
function triggerUpload() {
    document.getElementById('fileUploadInput').click();
}


/* 
   ================================================================
   SECTION 4: "RUN ALL" WORKFLOW
   ================================================================
*/
function runAllSequence() {
    const code = myEditor.getValue();
    if (!code.trim()) {
        alert("No code to run!");
        return;
    }

    // Programmatically click compile
    $('#btnCompile').click();

    // Wait 1.5s for compile animation, then click Run
    setTimeout(function() {
        if (!$('#btnRun').prop('disabled')) {
            $('#btnRun').click();
            
            // Scroll to output on mobile
            if(window.innerWidth < 1024) {
               $('html, body').animate({
                   scrollTop: $("#terminalBody").offset().top - 80
               }, 500);
            }
        }
    }, 1500);
}

/* 
   ================================================================
   SECTION 6: SHARING LOGIC (FIXED)
   ================================================================
*/

// Global variable to store selected permission
let currentSharePerm = 'read';

// 1. OPEN MODAL
function openShareModal() {
    $('#shareModal').fadeIn(200).css('display', 'flex');
    $('#shareResultWrapper').addClass('hidden'); // Hide result on new open
    $('#btnGenLink').prop('disabled', false).text('GENERATE LINK');
    selectPermission('read'); // Reset to default
}

// 2. CLOSE MODAL
function closeShareModal() {
    $('#shareModal').fadeOut(200);
}

// 3. SELECT PERMISSION (UI Toggle)
function selectPermission(perm) {
    currentSharePerm = perm;
    
    // Reset all buttons styling
    $('.perm-btn').removeClass('bg-blue-600 text-white border-blue-500').addClass('bg-white/5 text-gray-400 border-white/10');
    
    // Highlight the selected one
    $(`#permBtn-${perm}`).removeClass('bg-white/5 text-gray-400 border-white/10').addClass('bg-blue-600 text-white border-blue-500');
}

// 4. GENERATE LINK (AJAX)
function generateLinkAction() {
    const code = myEditor.getValue();
    
    // UI Loading State
    const btn = $('#btnGenLink');
    btn.text('GENERATING...').prop('disabled', true);

    $.ajax({
        url: '/share',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
            code: code, 
            permission: currentSharePerm 
        }),
        success: function(res) {
            // Success! Show the result box
            $('#shareResultWrapper').removeClass('hidden').hide().slideDown(200);
            
            // Put the link in the input box
            $('#shareLinkInput').val(res.link);
            
            // Reset button
            btn.text('LINK GENERATED').prop('disabled', false);
        },
        error: function(err) {
            alert("Error generating link. Please try again.");
            btn.text('GENERATE LINK').prop('disabled', false);
        }
    });
}

// 5. COPY TO CLIPBOARD
function copyLinkToClipboard() {
    // Get the text field
    var copyText = document.getElementById("shareLinkInput");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value).then(() => {
        // Show "Copied!" message
        $('#copyFeedback').slideDown(100).delay(2000).slideUp(100);
    }).catch(err => {
        // Fallback if secure copy fails
        document.execCommand("copy");
        alert("Copied link!");
    });
}

/* 
   ================================================================
   SECTION 5: MAIN LOGIC (When Page Loads)
   ================================================================
*/
$(document).ready(function() {
    
    


    // 1. DEFINE SYNTAX RULES (Must be done before creating editor)
    CodeMirror.defineSimpleMode("naturalscript", {
        start: [
            { regex: /(?:set|var|loop|if|else)\b/, token: "keyword" },
            { regex: /(?:print|alert|clear|write)\b/, token: "system" },
            { regex: /(?:add|sub|mul|div|mod)\b/, token: "operator" },
            { regex: /(?:to|from|by|as)\b/, token: "operator" },
            { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
            { regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string" },
            { regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number" },
            { regex: /#.*/, token: "comment" },
            { regex: /\/\/.*/, token: "comment" }
        ]
    });

    // 2. INITIALIZE EDITOR
    myEditor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        mode: "naturalscript",
        theme: "abbott",
        lineNumbers: true,
        scrollbarStyle: "native",
        lineWrapping: true
    });
    
        // CALL IT IMMEDIATELY
    applyUserSettings();

    // 3. AUTO-SAVE & AUTO-LOAD
    myEditor.on("change", function() {
        const currentCode = myEditor.getValue();
        localStorage.setItem("AetherByte_AutoSave", currentCode);
    });

    const savedCode = localStorage.getItem("AetherByte_AutoSave");
    if (savedCode) {
        myEditor.setValue(savedCode);
    } else {
        myEditor.setValue('set score to 10\nprint "System Ready"\nprint score');
    }


    // 4. UI TOGGLE BUTTONS
    $('.toggle-btn').click(function() {
        const target = $(this).data('target');
        const icon = $(this).data('icon');
        $(target).slideToggle(200, function() {
            if (target === "#editorBody" && myEditor) {
                myEditor.refresh(); // Fix layout if hidden
            }
        });
        $(icon).toggleClass('rotate-180');
    });


    // 5. COMPILE BUTTON CLICK
    $('#btnCompile').click(function() {
        // Get Code from Editor
        const code = myEditor.getValue();
        
        if (!code.trim()) return;
        
        const btn = $(this);
        const originalText = btn.html();
        btn.html('...').prop('disabled', true);

        $.ajax({
            url: '/convert',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ code: code }),
            success: function(res) {
                // START TWEAK: AUTO-CLEAR
                const autoClear = (localStorage.getItem('AetherAutoClear') === 'true');
                if(autoClear) {
                    $('#consoleContent').empty(); // Clear terminal now
                }
                // END TWEAK
                currentBinary = res.binary;
                const binDiv = $('#binaryOutput');
                binDiv.empty();
                
                // Open section if closed
                if($('#binaryBody').is(':hidden')) { 
                    $('#binaryBody').slideDown(); 
                    $('#binaryIcon').addClass('rotate-180'); 
                }
                
                // START TWEAK: ANIMATION SPEED
                // Read speed from settings, default to 5ms
                const speedSetting = parseInt(localStorage.getItem('AetherBinSpeed') || '5');

                const lines = res.binary.split('\n');
                
                // Fast streaming animation
                lines.forEach((line, i) => {
                    setTimeout(() => {
                        const opCode = line.substring(0, 8);
                        const data = line.substring(8);
                        const html = `<span class="bin-op">${opCode}</span><span class="bin-data">${data}</span>`;
                        
                        binDiv.append(`<div class="mb-1 border-b border-white/5 pb-1 font-mono text-xs">${html}</div>`);
                        binDiv.scrollTop(binDiv[0].scrollHeight);
                    }, i * speedSetting); // 5ms delay
                });

                // Reset buttons after animation
                setTimeout(() => {
                    btn.html(originalText).prop('disabled', false);
                    $('#btnRun').prop('disabled', false)
                        .removeClass('opacity-50 cursor-not-allowed')
                        .addClass('shadow-[0_0_20px_rgba(235,0,41,0.5)]');
                    
                    if(window.innerWidth < 1024) { 
                        $('html, body').animate({ scrollTop: $("#binaryBody").offset().top - 80 }, 500); 
                    }
                }, lines.length * 5 + 100);
            },
            error: function() {
                alert("Compilation Failed");
                btn.html(originalText).prop('disabled', false);
            }
        });
    });


    // 6. EXECUTE BUTTON CLICK (UPDATED)
    $('#btnRun').click(function() {
        
        // CHECK: If user is currently typing in the binary box, save it first!
        if (isBinaryEditing) {
             const manualCode = $('#binaryEditor').val().trim();
             if (manualCode) currentBinary = manualCode;
        }

        if (!currentBinary) return;
        
        const consoleDiv = $('#consoleContent');
        
        // Open Terminal if closed
        if ($('#terminalBody').is(':hidden')) {
            $('#terminalBody').slideDown(); 
            $('#terminalIcon').addClass('rotate-180');
        }
        
        // Scroll on mobile
        if (window.innerWidth < 1024) {
            $('html, body').animate({
                scrollTop: $("#terminalBody").offset().top - 80
            }, 500);
        }

        consoleDiv.append('<div class="text-gray-500 mt-2 border-t border-gray-800 pt-2">> Executing binary stream...</div>');

        $.ajax({
            url: '/run',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ binary: currentBinary }),
            success: function(res) {
                const lines = res.output.split('\n');
                lines.forEach(line => {
                    if (line === "__CLEAR__") {
                        consoleDiv.empty();
                    } else if (line.startsWith("ERR")) {
                        consoleDiv.append(`<div class="text-red-500 font-bold bg-red-500/10 p-1 inline-block rounded my-1">${line}</div><br>`);
                    } else {
                        consoleDiv.append(`<div class="text-green-400 font-bold my-1 pl-2 border-l-2 border-green-500">${line}</div>`);
                    }
                });
                $('#terminalBody').scrollTop($('#terminalBody')[0].scrollHeight);
            }
        });
    });

});