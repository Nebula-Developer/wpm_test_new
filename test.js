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
var sim_on_start = 100;

function create_test(text) {
    wpm_test = structuredClone(wpm_test_base);
    wpm_test.text = text;

    var test = $("#wpm-test");
    test.empty();
    test.append("<div id='cursor'></div>");
    test.append("<div id='cursor-sim'></div>");

    var words = text.split(" ");
    for (var i = 0; i < words.length; i++) {
        var word = create_word(words[i]);
        test.append(word.element);

        wpm_test.text_elms.push(...word.letters);
        
        var space = $("<div class='space'></div>");
        word.element.append(space);
        wpm_test.text_elms.push(space);
    }

    wpm_test.cursor_index = 0;
}

function create_word(word) {
    var word_elm = $("<div class='word'></div>");
    var word_letters = [];
    for (var i = 0; i < word.length; i++) {
        var letter = $("<div class='letter'></div>");
        if (i < 3) letter.addClass("bold-letter");
        letter.text(word[i]);
        word_elm.append(letter);
        word_letters.push(letter);
    }

    return {
        element: word_elm,
        letters: word_letters
    };
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

function start_test() {
    wpm_test.test_active = true;
    wpm_test.test_config.start = null;
}

function reset_test() {
    create_test(gen_sentence(wpm_test.test_config.wordCount));
    start_test();
    $("#wpm-test").trigger("focus");
    $("#wpm-test-result").addClass("hidden");
}
