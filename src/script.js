$(function () {

    var map = L.map('game');
    map.fitBounds([
        [33.7846554, 34.9790105],
        [16.5713638, 59.5905119]
    ]);

    var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
        subdomains: 'abcd',
        minZoom: 1,
        maxZoom: 16,
        ext: 'jpg'
    });

    const jerusalem_icon = L.icon({
        iconUrl: 'src/dome.png',
        iconSize: [30, 30],
        iconAnchor: [0, 15],
    });

    const mecca_icon = L.icon({
        iconUrl: 'src/kaaba.png',
        iconSize: [30, 30],
        iconAnchor: [-15, 15],
    });

    const medina_icon = L.icon({
        iconUrl: 'src/medina_mosque.png',
        iconSize: [30, 30],
        iconAnchor: [-0, 15],
    });


    const jerusalem = L.marker([31.7964453, 35.1053192], {
        title: "Jerusalem",
        icon: jerusalem_icon

    });

    const mecca = L.marker([21.4362767, 39.7064625], {
        title: "Mecca",
        icon: mecca_icon

    });
    const medina = L.marker([24.5175721, 39.5579209], {
        title: "Medina",
        icon: medina_icon
    });


    Stamen_Watercolor.addTo(map);
    jerusalem.addTo(map);
    mecca.addTo(map);
    medina.addTo(map);
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    const questions = [
        ["Who were the \"followers of Ali\"?", "shia", "standard"],
        ["Who beleived the leader of Islam should be chosen, not inherited?", "sunni", "standard"],
        ["Who beleive that Allah is the one true god?", "both", "standard"],
        ["Who beleive that the Quaran recalls the last revalations from Allah", "both", "standard"],
        ["who are none", "neither", "standard"]
    ];

    for (q = 0; q < questions.length; q++) {

        questions[q][0] = (q + 1) + ". " + questions[q][0];
        console.log(questions[q][0], "(" + questions[q][1] + ")");

    }

    questions.push(["Bonus: Which sect of Islam is the most common in Jerusalem?", "sunni", "bonus"]);


    $(".leaflet-control-zoom").css("visibility", "hidden");



    const timeout = async ms => new Promise(res => setTimeout(res, ms));
    let next = false; // this is to be changed on user input
    let user_answer = "";



    async function waitUserInput() {
        while (next === false) {
            console.log("waiting for input...");
            await timeout(50);
        } // pause script but avoid browser to freeze ;)
        next = false; // reset var

    }




    async function run(map, questions, recurse, quiz_length = null, q_num = 0) {
        if (recurse == 0) {
            alert("Good Game!")
            return;
        }
        if (quiz_length === null) {
        
            quiz_length = questions.length;
        }
        /*
        code help at = "https://stackoverflow.com/questions/51013412/how-to-do-javascript-await-on-user-input-in-an-async-function"
        */


        const startPos = [32, 35], endPos = [21, 40],
            xDiff = endPos[0] - startPos[0],
            yDiff = endPos[1] - startPos[1],
            currX = (q_num * xDiff / quiz_length) + startPos[0],
            currY = (q_num * yDiff / quiz_length) + startPos[1],
            player_icon = "src/player.png", size = 1.5;
        console.log(q_num, quiz_length)
        console.log(xDiff, yDiff, q_num)
        let location = [
            [currX, currY],
            [currX + size, currY + size]
        ]

        const player = L.imageOverlay(player_icon, location);
        player.bringToFront().addTo(map);
        $('#q-field').text(questions[0][0]);
        await waitUserInput();

        console.log("answered with", user_answer);
        if (user_answer == questions[0][1]) {
            //correct
            console.log(user_answer, "is correct");

            $('#point-counter').text(+($('#point-counter').text()) + 10);
            $('#' + user_answer).css('background-color', 'green');
            setTimeout(function () {
                $('#' + user_answer).css('background-color', 'white');
            }, 250);
            console.log(quiz_length)
            questions.shift();
            run(map, questions, questions.length, quiz_length, q_num+1);

        } else {
            //answer was inncorrect
            $('#' + user_answer).css('background-color', 'red');
            setTimeout(function () {
                $('#' + user_answer).css('background-color', 'white');
            }, 250);
            if (questions[0][2] === "standard") {
                $('#point-counter').text(+($('#point-counter').text()) - 10);
            } else { //(if the question was a bonus)
                questions.shift();
                run(map, questions, questions.length, quiz_length, q_num+1);
            }

            console.log(user_answer, "is incorrect");
            run(map, questions, questions.length, quiz_length, q_num);
        }




    }
    $('.answer').click(function () { // If an answer was clicked
        next = true;
        user_answer = $(this).attr('id');
    });
    run(map, questions, questions.length);
});