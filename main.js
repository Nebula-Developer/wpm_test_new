

var wpm_test = {
    cursor_index: 0,
    text: "This is a test of the WPM test system",
    user_text: "",
    text_elms: [],
    test_active: false
}

function create_test(text) {
    wpm_test.text = text;
    wpm_test.cursor_index = 0;
    wpm_test.test_active = false;
    wpm_test.text_elms = [];
    wpm_test.user_text = "";

    var test = $("#wpm-test");
    test.empty();
    test.append("<div id='cursor'></div>");

    var words = text.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = create_word(words[i]);
        test.append(word.element);

        wpm_test.text_elms.push(...word.letters);
            
        if (i != words.length - 1) {
            var space = $("<div class='space'></div>");
            test.append(space);
            wpm_test.text_elms.push(space);
        }
    }

    var endChar = $("<div class='end-char'></div>");
    test.append(endChar);
    wpm_test.text_elms.push(endChar);

    wpm_test.cursor_index = 0;
}

function create_word(word) {
    var word_elm = $("<div class='word'></div>");
    var word_letters = [];
    for (var i = 0; i < word.length; i++) {
        var letter = $("<div class='letter'></div>");
        letter.text(word[i]);
        word_elm.append(letter);
        word_letters.push(letter);
    }

    return {
        element: word_elm,
        letters: word_letters
    };
}

create_test("Hello, world!");

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (!wpm_test.test_active) {
        wpm_test.test_active = true;
        console.log("Test started");
    }

    var key = e.key;

    if (key == "Backspace") {
        if (wpm_test.cursor_index > 0) {
            wpm_test.cursor_index--;
            wpm_test.text_elms[wpm_test.cursor_index].removeClass("correct");
            wpm_test.text_elms[wpm_test.cursor_index].removeClass("incorrect");
            wpm_test.user_text = wpm_test.user_text.substring(0, wpm_test.user_text.length - 1);
        }
    }
    
    else if (key.length != 1 || wpm_test.cursor_index >= wpm_test.text_elms.length) {
        return;
    }

    else if (wpm_test.text[wpm_test.cursor_index] == key) {
        console.log("Correct");
        wpm_test.text_elms[wpm_test.cursor_index].addClass("correct");
        wpm_test.user_text += key;
        wpm_test.cursor_index++;
    } else {
        console.log("Incorrect");
        wpm_test.text_elms[wpm_test.cursor_index].addClass("incorrect");
        wpm_test.user_text += key;
        wpm_test.cursor_index++;
    }

    var curElm = wpm_test.text_elms[wpm_test.cursor_index];
    if (curElm) {
        $("#cursor").css("top", curElm.position().top);
        $("#cursor").css("left", curElm.position().left);
    }
});
