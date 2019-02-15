const GameState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    NAME:  Symbol("name"),
    REAL_NAME: Symbol("Real Name"),
    FAKE_NAME: Symbol("Fake Name"),
    NAME_REPEAT: Symbol("Name Again"),
    WAKE_UP: Symbol("Wake Up"),
    DOOR: Symbol("Door"),
    TABLE: Symbol("Table"),
    BED: Symbol("Bed"),
    CHECK_STATE_1: Symbol("Check state 1"),
    CHECK_STATE_2: Symbol("Check state 2"),
    PLAY_ROOM: Symbol("Play room"),
    START_AGAIN: Symbol("Start again"),
    PICTURE: Symbol("Picture"),
    BEHIND_PICTURE: Symbol("Behind picture"),
    END: Symbol("End")
});


export default class Game{
    constructor(){
        this.stateCur = GameState.WELCOMING;
        this.mapWakeUpRoom = ["|||||||||||||||||||||||||",
                            "|  /_________   |",
                            "|  |************|  |",
                            "|  |************|  |",
                            "|  /_________|"]
        this.name = "fool"
        this.inventory = []
        this.mapHall = ["|||||||||||||||||||||||||",
                        "|  /_________   |",
                        "|  |___*********|  |",
                        "|  |************|  |",
                        "|!!/_________|"]
        this.time = new Date()
        this.map = this.mapWakeUpRoom
        this.break = false
    }
    
    printMap(map){
        let sMap = "You are !! \n"
        map.forEach(line => {
            sMap += line + '\n'
        });
        return [sMap]
    }

    makeAMove(sInput){
        let sReply = ""
        if(sInput.toLowerCase().match("map") && this.inventory.includes("map")){
            return this.printMap(this.map)
        }
        if(sInput.toLowerCase().match("inventory")){
            let sInventory = ""
            this.inventory.forEach(item =>{
                sInventory += item + "\n"
            })
            return [sInventory]
        }
        switch(this.stateCur){
            case GameState.WELCOMING:
                sReply = "Hi. My name is Mystery. \nI will help in this game. \n How can I call you?"
                this.stateCur = GameState.NAME
                break
            case GameState.NAME:
                if(sInput.toLowerCase().match("hi")){
                    this.stateCur = GameState.REAL_NAME
                    sReply = sInput.split(" ")
                    sReply = sReply[sReply.length - 1]
                    this.name = sReply
                    sReply += "?(YES or NO)"
                    break
                } else if(!sInput.toLowerCase().match("hi")) {
                    sReply = `I will call you ${this.name}. Are you agree?(YES or NO)`
                    this.stateCur = GameState.FAKE_NAME
                    break
                }
            case GameState.REAL_NAME:
                if(sInput.toLowerCase().match("no") || sInput.toLowerCase().match("n")){
                    sReply = `Pls type your name again`
                    this.stateCur = GameState.NAME_REPEAT
                    break
                } else{
                    sReply = `Get ready ${this.name} you will go to sleep. \n This is part of rules. \n See you later. Click \n ...Type anything to continue...`
                    this.stateCur = GameState.WAKE_UP
                    break
                }
            case GameState.FAKE_NAME:
                sReply = [`Ok, ${this.name}. Click.\n You go to sleep, ${this.name} \n ...Type anything to continue...`]
                this.stateCur = GameState.WAKE_UP
                break
            case GameState.NAME_REPEAT:
                this.name = sInput
                this.stateCur = GameState.WAKE_UP
                sReply = `Now. When we finish with greetings I will proceed. \n Click \n Oh, I should have warned him.. \n ...Type anything to continue...`
                break
            case GameState.WAKE_UP: 
                if(sInput.toLowerCase().match("click")){
                    sReply = "Seriously? You try to pretend that you are magician? I`m the only one! \n You found an Easter Eggs, \n Your creator"
                } else{
                    sReply = `You woke up in the room with TABLE, bed, and DOOR`
                }
                this.stateCur = GameState.CHECK_STATE_1
                break
            case GameState.CHECK_STATE_1:
                if(sInput.toLowerCase().match("door")){
                    if(this.inventory.includes("wakeUpDoorKey")) {
                        this.stateCur = GameState.CHECK_STATE_2
                        this.map = this.mapHall
                        this.inventory = this.inventory.filter(x => x != "wakeUpDoorKey")
                        sReply = "You are staying at the hall. There are three dors for WAKE UP, CHILDREN and PLAY rooms. Also there is a big PICTURE"
                    } else if(!this.inventory.includes("wakeUpDoorKey")){
                        sReply = "Dor is closed. You can go to BED or TABLE"
                        this.stateCur = GameState.CHECK_STATE_1
                    }
                    break
                } else if(sInput.toLowerCase().match("table")){
                    this.stateCur = GameState.TABLE
                    sReply = "You can see "
                    if(!this.inventory.includes("map")){
                        sReply += "MAP "
                    } 
                    if(!this.inventory.includes("wakeUpDoorKey")){
                        sReply += "KEY"
                    }
                    break
                } else if(sInput.toLowerCase().match("bed")){
                    this.stateCur = GameState.CHECK_STATE_1
                    sReply = "It is always good to go back to the plays where you woke up but there is nothing useful. You can go to TABLE or DOOR"
                    break
                } else {
                    sReply = "Can you repeat where you want to go? DOOR, TABLE, BED"
                    break
                }
            case GameState.TABLE:
                if(sInput.toLowerCase().match("key") && !this.inventory.includes("wakeUpDoorKey")){
                    this.inventory.push("wakeUpDoorKey")
                    sReply = "key added to your INVENTORY"
                } else if(sInput.toLowerCase().match("map") && !this.inventory.includes("map")){
                    this.inventory.push("map")
                    sReply = "map added to your INVENTORY"
                } 
                if(this.inventory.includes("map") && this.inventory.includes("wakeUpDoorKey")){
                    sReply = "Nothing to do here. You can go to DOOR or BED or TABLE"
                    this.stateCur = GameState.CHECK_STATE_1
                }
                break
            case GameState.CHECK_STATE_2:
                if(sInput.toLowerCase().match("wake up")){
                    sReply = "This is room where you woke up, there is nothing to do here"
                    break
                } else if(sInput.toLowerCase().match("play")){
                    sReply = "...Door closed behind you... \n It is me, Mystery. \n You should not came here \n There is only 5s to do something. \n I can not talk..."
                    this.stateCur = GameState.PLAY_ROOM
                } else if(sInput.toLowerCase().match("picture") && this.break == true){
                    sReply = "...possible ways to Breaking The Wall"
                }else if(sInput.toLowerCase().match("picture")){
                    sReply = "You are staying in front of big picture. There is MESSAGE written on it"
                    this.stateCur = GameState.PICTURE
                } else if(sInput.toLowerCase().match("children")){
                    sReply = "It is terrifying kids room"
                } else if(this.break == true && sInput.toLowerCase().match("break")){
                    sReply = "You get to the secret room. It is the only way to get out\n ...To be continue..."
                    this.stateCur = GameState.END
                } else{
                    sReply = "Where do you want to go? WAKE UP, CHILDREN, PLAY or PICTURE"
                }
                break
            case GameState.PLAY_ROOM:
                this.time = Date.now()
                if(Math.abs(this.time - Date.now()) > 5){
                    sReply = "You are dead. to start again type /q"
                    this.stateCur = GameState.START_AGAIN
                }
                break
            case GameState.START_AGAIN:
                if(sInput.toLowerCase().match("/q")){
                    this.stateCur = GameState.WELCOMING
                    this.inventory = []
                    this.map = this.mapWakeUpRoom
                    this.time = new Date()
                    this.break = false
                    break
                }
            case GameState.PICTURE:
                if(sInput.toLowerCase().match("message")){
                    sReply = "He will not always tell you about all...\n ...this message goes behind the wall..."
                    this.stateCur = GameState.BEHIND_PICTURE
                } else {
                    sReply = "Where do you want to go? WAKE UP, CHILDREN, PLAY or PICTURE"
                    this.stateCur = GameState.CHECK_STATE_2
                }
                break
            case GameState.BEHIND_PICTURE:
                if(sInput.toLowerCase().match("behind")){
                    sReply = "...possible ways to Breaking The Wall"
                    this.break = true
                    this.stateCur = GameState.CHECK_STATE_2
                } else {
                    this.stateCur = GameState.CHECK_STATE_2
                    sReply = "Where do you want to go? WAKE UP, CHILDREN, PLAY or PICTURE"
                }
                break
            case GameState.END:
                sReply = "Author Kolombet Mykola"
                break
        }
        return [sReply]
    }

}

