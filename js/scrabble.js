// User Information
// Name: [Denzel Ohene Sakyi]
// Contact: [Denzel_OheneSakyi@student.uml.edu]
//Sites used to help me out to write out my functions
// Log the position of the tile after it's dropped
// Source: https://stackoverflow.com/questions/885144/how-to-get-current-position-of-an-image-in-jquery
// Function to add an image at specific coordinates
    // Source: https://stackoverflow.com/questions/9704087/jquery-add-image-at-specific-co-ordinates
$(document).ready(function() {
    var ScrabbleTiles = {
        "A": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
        "B": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "C": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "D": { "value": 2, "original-distribution": 4, "number-remaining": 4 },
        "E": { "value": 1, "original-distribution": 12, "number-remaining": 12 },
        "F": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "G": { "value": 2, "original-distribution": 3, "number-remaining": 3 },
        "H": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "I": { "value": 1, "original-distribution": 9, "number-remaining": 9 },
        "J": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
        "K": { "value": 5, "original-distribution": 1, "number-remaining": 1 },
        "L": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "M": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "N": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "O": { "value": 1, "original-distribution": 8, "number-remaining": 8 },
        "P": { "value": 3, "original-distribution": 2, "number-remaining": 2 },
        "Q": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
        "R": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "S": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "T": { "value": 1, "original-distribution": 6, "number-remaining": 6 },
        "U": { "value": 1, "original-distribution": 4, "number-remaining": 4 },
        "V": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "W": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "X": { "value": 8, "original-distribution": 1, "number-remaining": 1 },
        "Y": { "value": 4, "original-distribution": 2, "number-remaining": 2 },
        "Z": { "value": 10, "original-distribution": 1, "number-remaining": 1 },
        "_": { "value": 0, "original-distribution": 2, "number-remaining": 2 }
    };

    var cumulativeScore = 0;
    var placedTiles = [];

    function getRandomLetter() {
        var totalTiles = 0;
        for (var key in ScrabbleTiles) {
            totalTiles += ScrabbleTiles[key]["number-remaining"];
        }
        var randIndex = Math.floor(Math.random() * totalTiles);
        var currentSum = 0;

        for (var key in ScrabbleTiles) {
            currentSum += ScrabbleTiles[key]["number-remaining"];
            if (randIndex < currentSum) {
                ScrabbleTiles[key]["number-remaining"]--;
                return key;
            }
        }
    }

    function dealNewTiles() {
        var currentTileCount = $("#tile-rack .tile").length;
        var tilesNeeded = 7 - currentTileCount;
        for (var i = 0; i < tilesNeeded; i++) {
            var letter = getRandomLetter();
            var tile = $("<div>")
                .addClass("tile")
                .css("background-image", "url('images/tiles/Scrabble_Tile_" + letter + ".jpg')")
                .data("letter", letter)
                .data("value", ScrabbleTiles[letter]["value"]);
            $("#tile-rack").append(tile);
        }
        $(".tile").draggable({
            revert: "invalid"
        });
    }

    function createBoardSquares() {
        const boardSquarePositions = [
            { id: "sq1", class: "" },
            { id: "sq2", class: "" },
            { id: "sq3", class: "" },
            { id: "sq4", class: "bonus-double" },
            { id: "sq5", class: "" },
            { id: "sq6", class: "" },
            { id: "sq7", class: "double-letter" },
            { id: "sq8", class: "" },
            { id: "sq9", class: "bonus-double" },
            { id: "sq10", class: "" },
            { id: "sq11", class: "double-letter" },
            { id: "sq12", class: "bonus-double" }
        ];

        boardSquarePositions.forEach(pos => {
            const square = $("<div>")
                .addClass("board-square")
                .attr("id", pos.id)
                .addClass(pos.class);

            $("#scrabble-board").append(square);
        });

        $(".board-square").droppable({
            accept: ".tile",
            drop: function(event, ui) {
                var targetId = $(this).attr("id");
                if (!$(this).data("tile") && isAdjacent(targetId)) {
                    var tileValue = ui.draggable.data("value");
                    var tileLetter = ui.draggable.data("letter");
                    $(this).data("tile", { letter: tileLetter, value: tileValue });
                    ui.draggable.css({
                        top: 0,
                        left: 0,
                        position: 'relative',
                        zIndex: 2
                    }).appendTo($(this)).draggable("option", "disabled", true);
                    placedTiles.push(targetId);
                    calculateScore();
                } else {
                    ui.draggable.draggable("option", "revert", true);
                }
            }
        });
    }

    function calculateScore() {
        var score = 0;
        var wordMultiplier = 1;
        $(".board-square").each(function() {
            var tile = $(this).data("tile");
            if (tile) {
                var letterMultiplier = 1; // Default letter multiplier
                if ($(this).hasClass("bonus-double")) {
                    wordMultiplier *= 2; // Double word score
                }
                if ($(this).hasClass("bonus-triple")) {
                    wordMultiplier *= 3; // Triple word score
                }
                if ($(this).hasClass("double-letter")) {
                    letterMultiplier = 2; // Double letter score
                }
                score += tile.value * letterMultiplier; // Add letter value * letter multiplier to score
            }
        });
        score *= wordMultiplier; // Apply word multiplier
        cumulativeScore = score; // Update cumulative score
        $("#score-display").text("Score: " + cumulativeScore);
    }

    function resetBoard() {
        $(".board-square").each(function() {
            $(this).removeData("tile").empty();
        });
        placedTiles = [];
    }

    function isAdjacent(targetId) {
        if (placedTiles.length === 0) return true;
        var targetIndex = parseInt(targetId.replace('sq', ''));
        for (var i = 0; i < placedTiles.length; i++) {
            var placedIndex = parseInt(placedTiles[i].replace('sq', ''));
            if (Math.abs(targetIndex - placedIndex) === 1) {
                return true;
            }
        }
        return false;
    }

    $("#deal-button").click(function() {
        dealNewTiles();
    });

    $("#restart-button").click(function() {
        resetBoard();
        cumulativeScore = 0;
        $("#score-display").text("Score: " + cumulativeScore);
    });

    createBoardSquares();
    dealNewTiles();
});
