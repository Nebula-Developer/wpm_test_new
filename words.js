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
