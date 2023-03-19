const wpm_test_types = {
    "words": 0,
    "time": 1
}

const wpm_test_base = {
    cursor_index: 0,
    text: "",
    user_text: "",
    text_elms: [],
    test_active: false,

    test_mode: "words",
    test_config: {
        wordCount: 10,
        time: 10000,
        start: 0,
        end: 0
    },

    mistakes: []
};

var wpm_test = structuredClone(wpm_test_base);

function create_test(text) {
    wpm_test = structuredClone(wpm_test_base);
    wpm_test.text = text;

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

const word_list = [
    "the", "of", "if", "can", "also",
    "and", "to", "in", "is", "you",
    "that", "it", "for", "was", "on",
    "are", "as", "with", "his", "they",
    "be", "at", "one", "have", "this",
    "from", "or", "had", "by", "hot",
    "nation", "but", "some", "what", "there",
    "we", "can", "out", "other", "were",
    "all", "there", "when", "up", "use",
    "your", "how", "said", "an", "each",
    "she", "which", "do", "their", "time",
    "if", "will", "way", "about", "many",
    "then", "them", "write", "would", "like"
];

function gen_sentence(words) {
    var sentence = "";
    for (var i = 0; i < words; i++) {
        var word = word_list[Math.floor(Math.random() * word_list.length)];
        sentence += word + (i == words - 1 ? "" : " ");
    }
    return sentence;
}

function calculate_test_results() {
    if (wpm_test.test_mode == "words") {
        // Calculate WPM based on how long it took
        // to type the specified number of words,
        // also counting how big the words were
        var time = wpm_test.test_config.end - wpm_test.test_config.start;
        var sentenceLength = wpm_test.text.length;
        var wpm = (sentenceLength / 5) / (time / 60000);
        return wpm;
    } else if (wpm_test.test_mode == "time") {
        // Calculate WPM based on how many words
        // were typed in the specified time
        var time = wpm_test.test_config.end - wpm_test.test_config.start;
        var sentenceLength = wpm_test.text.length;
        var wpm = (sentenceLength / 5) / (time / 60000);
        return wpm;
    }
}


/**
 * @param {KeyboardEvent} e
 */
function handle_keypress(e) {
    if (wpm_test.test_config.start == null) wpm_test.test_config.start = Date.now();
    var key = e.key;

    var isValidKey = (
        (!e.metaKey && !e.ctrlKey && !e.altKey) &&
        (key == "Backspace" || key == " " ||
        key.length == 1)
    );

    if (!isValidKey) return;

    switch (key) {
        case "Backspace":
            if (wpm_test.cursor_index > 0) {
                wpm_test.cursor_index--;
                wpm_test.text_elms[wpm_test.cursor_index].removeClass("correct");
                wpm_test.text_elms[wpm_test.cursor_index].removeClass("incorrect");
                wpm_test.user_text = wpm_test.user_text.substring(0, wpm_test.user_text.length - 1);
            }
            break;
        
        default:
            e.preventDefault();
            if (wpm_test.text[wpm_test.cursor_index] == key) {
                wpm_test.text_elms[wpm_test.cursor_index].addClass("correct");
                wpm_test.user_text += key;
                wpm_test.cursor_index++;
                break;
            }

            wpm_test.text_elms[wpm_test.cursor_index].addClass("incorrect");
            wpm_test.user_text += key;

            if (!wpm_test.mistakes.find(m => m.index == wpm_test.cursor_index)) {
                wpm_test.mistakes.push({
                    index: wpm_test.cursor_index,
                    char: key
                });
            }

            wpm_test.cursor_index++;
            break;
    }

    var curElm = wpm_test.text_elms[wpm_test.cursor_index];
    if (curElm) {
        $("#cursor").css("top", curElm.position().top);
        $("#cursor").css("left", curElm.position().left);
    }

    if (wpm_test.cursor_index >= wpm_test.text_elms.length - 1) {
        wpm_test.test_active = false;
        wpm_test.test_config.end = Date.now();
        console.log("WPM: " + calculate_test_results());
        console.log("Accuracy: " + calculate_test_accuracy());
    }
}

document.addEventListener('keydown', (e) => {
    if (!$("#wpm-test").is(":focus")) return;
    if (e.key == "Tab") {
        e.preventDefault();
        $("#wpm-test-restart").trigger("focus");
        return;
    }
    if (!wpm_test.test_active) return;
    handle_keypress(e);
});

function calculate_test_accuracy() {
    var mistakes = wpm_test.mistakes.length;
    var sentenceLength = wpm_test.text.length;
    var accuracy = (sentenceLength - mistakes) / sentenceLength;
    return accuracy;    
}

function start_test() {
    wpm_test.test_active = true;
    wpm_test.test_config.start = null;
}

create_test(gen_sentence(10));

$("#wpm-test-restart").on('click', (e) => {
    e.preventDefault();
    create_test(gen_sentence(10));
    start_test();
    $("#wpm-test").trigger("focus");
});

start_test();