
$(function()
{
    var version = "1.6";

    var config = {
        type: Phaser.AUTO,
        width: $("#game_div").width(),
        height: $("#game_div").height(),
        parent: 'game_div',
        physics: {
            default: 'arcade',
            arcade: {
                fps: 120,
                debug: false
            }
        },
        scene: {
            key: 'main',
            preload: preload,
            create: create,
            update: update
        },
        backgroundColor: "#000000"
    };

    var game = new Phaser.Game(config);
    var scene;

    var map;
    var player;
    var cursors;
    var joycursors;
    var joyStick;
    var fireButton;

    var groundLayer;
    var sandiklar;
    var gizliplatformlar;
    var kafaplatformlar;
    var kasalar;

    var text, text2;
    var score = 0;
    //score = 38; // debug
    var background;
    var floor_y = 1919;
    var gravity = 500;
    var onFloor = false;
    var onFloorVal = 0;
    var onFloorStrict = false;
    var onFloorStrictVal = new Array();
    var playing = false;
    var collectSounds = new Array();
    var backMusic;
    var oyfarki = 20141;
    //oyfarki = 100; // debug

    // ending
    var dynamic = null;
    var value = 0;
    var s = {
        y: 10
    };

    var character_name = "player_imamoglu";
    var select_char;
    var char_imam;
    var char_kilicdar;
    var char_yavas;
    var char_atilla;

    var sound_button;

    var player_start_x = 100; // 100

    function preload()
    {

        this.load.tilemapTiledJSON('map', 'assets/map2.json?v=' + version);

        this.load.spritesheet('tiles', 'assets/tiles2.png?v=' + version, {frameWidth: 70, frameHeight: 70});

        this.load.spritesheet('dans', 'assets/dans.jpg?v=' + version, {frameWidth: 300, frameHeight: 162});

        this.load.image('box', 'assets/box.png?v=' + version);

        this.load.image('intro_logo', 'assets/intro_logo2.png?v=' + version);

        this.load.image('select_char', 'assets/selectChar.png?v=' + version);

        this.load.image('nasil_button', 'assets/nasil.png?v=' + version);

        this.load.image('startButton', 'assets/start.png?v=' + version);

        this.load.atlas('player_imamoglu', 'assets/imamoglu.png?v=' + version, 'assets/character.json?v=' + version);
        this.load.atlas('player_kilicdar', 'assets/kilicdaroglu.png?v=' + version, 'assets/character.json?v=' + version);
        this.load.atlas('player_atilla', 'assets/atilla.png?v=' + version, 'assets/character.json?v=' + version);
        this.load.atlas('player_yavas', 'assets/yavas.png?v=' + version, 'assets/character.json?v=' + version);

        this.load.image('char_imam', 'assets/char_imam.png?v=' + version);
        this.load.image('char_kilicdar', 'assets/char_kilicdar.png?v=' + version);
        this.load.image('char_atilla', 'assets/char_atilla.png?v=' + version);
        this.load.image('char_yavas', 'assets/char_yavas.png?v=' + version);
        this.load.image('char_hidden', 'assets/char_hidden.png?v=' + version);

        this.load.image('background', 'assets/background2.png?v=' + version);

        this.load.image('fireButton', 'assets/fireButton.png?v=' + version);

        this.load.audio('hak', 'snd/hak.mp3?v=' + version);
        this.load.audio('ysk', 'snd/ysk.mp3?v=' + version);
        this.load.audio('aa', 'snd/aa.mp3?v=' + version);
        this.load.audio('mac', 'snd/mac.mp3?v=' + version);
        this.load.audio('istanbulu', 'snd/istanbulu.mp3?v=' + version);
        this.load.audio('boyle', 'snd/boyle.mp3?v=' + version);
        this.load.audio('cokelek', 'snd/cokelek.mp3?v=' + version);
        this.load.audio('zennube', 'snd/zennube.mp3?v=' + version);
        this.load.audio('yamyam', 'snd/yamyam.mp3?v=' + version);
        this.load.audio('yerim', 'snd/yerim.mp3?v=' + version);
        this.load.audio('adina', 'snd/adina.mp3?v=' + version);
        this.load.audio('darisi', 'snd/darisi.mp3?v=' + version);
        this.load.audio('hudayda', 'snd/hudayda.mp3?v=' + version);

        this.load.audio('music', 'snd/music2.mp3?v=' + version);
        this.load.audio('izmir', 'snd/izmir.mp3?v=' + version);
        this.load.audio('giana', 'snd/giana.mp3?v=' + version);
        this.load.audio('button', 'snd/button.mp3?v=' + version);
        this.load.audio('pling', 'snd/pling.mp3?v=' + version);

        this.load.audio('biz', 'snd/biz.mp3?v=' + version);
        this.load.audio('beyoglu', 'snd/beyoglu.mp3?v=' + version);
        this.load.audio('isengard', 'snd/isengard.mp3?v=' + version);
        this.load.audio('hudayda2', 'snd/hudayda2.mp3?v=' + version);

        this.load.plugin('rexvirtualjoystickplugin', 'js/rexvirtualjoystickplugin.min.js?v=' + version, true);

        this.load.image('knighthawks', 'assets/knight3.png?v=' + version);

        this.load.image('raster', 'assets/raster.png?v=' + version);

        this.load.image('imamoglu_end', 'assets/imamoglu_end.png?v=' + version);
        this.load.image('chair', 'assets/chair.png?v=' + version);
        this.load.image('aragorn', 'assets/aragorn.png?v=' + version);

        this.load.image('raster2', 'assets/raster-bw-64.png?v=' + version);

        this.load.image('share_facebook', 'assets/share_facebook.png?v=' + version);
        this.load.image('share_twitter', 'assets/share_twitter.png?v=' + version);
    }

    function create()
    {
        scene = this;

        // write version number
        var version_text = this.add.text(this.sys.game.config.width - 5, this.sys.game.config.height - 5, '0', {
                fontFamily: 'Roboto',
                fontSize: '11px',
                fill: '#FF0000',
                shadow: {
                    offsetX: 0,
                    offsetY: 1,
                    color: '#000',
                    blur: 2,
                    fill: true
                },
            });
        version_text.setOrigin(1,1);
        version_text.setScrollFactor(0);
        version_text.depth = 150;
        version_text.setText("v" + version);

        var sound_button = this.sound.add('button');

        var intro_logo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 100, 'intro_logo');
        if (this.sys.game.config.width < 500) intro_logo.setScale(0.6);
        intro_logo.setScrollFactor(0);
        intro_logo.depth = 50;

        var group = this.add.group();
        group.createMultiple({ key: 'raster2', repeat: 8 });
        var ci = 0;
        var colors = [ 0xef658c, 0xff9a52, 0xffdf00, 0x31ef8c, 0x21dfff, 0x31aade, 0x5275de, 0x9c55ad, 0xbd208c ];
        var _this = this;
        group.children.iterate(function (child)
        {
            child.x = 0;
            child.y = this.sys.game.config.height / 2;
            child.depth = 9 - ci;
            child.setScrollFactor(0);

            child.tint = colors[ci];

            ci++;

            _this.tweens.add({
                targets: child,
                x: this.sys.game.config.width,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
                duration: 1500,
                delay: 100 * ci
            });
        }.bind(this));

        var start_button = this.add.sprite(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 150, 'startButton');
        if (this.sys.game.config.width < 500) start_button.setScale(0.6);
        start_button.setScrollFactor(0);
        start_button.depth = 50;
        start_button.setInteractive({useHandCursor: true});
        start_button.on('pointerover', function (event)
        {
            this.setTint(0xACACAC);
        });
        start_button.on('pointerout', function (event)
        {
            this.clearTint();
        });
        start_button.on('pointerup', function (event)
        {
            sound_button.play();
            scene.characterSelect();
        });

        var nasil_button = this.add.image(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 50, 'nasil_button');
        if (this.sys.game.config.width < 500) nasil_button.setScale(0.6);
        nasil_button.setScrollFactor(0);
        nasil_button.depth = 50;
        nasil_button.setInteractive({useHandCursor: true});
        nasil_button.on('pointerup', function (event)
        {
            sound_button.play();
            document.location = "#nasil";
        });

        this.characterSelect = function()
        {
            start_button.destroy();
            intro_logo.destroy();

            select_char = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 150, 'select_char');
            if (this.sys.game.config.width < 500) select_char.setScale(0.8);
            select_char.setScrollFactor(0);
            select_char.depth = 50;

            char_imam = this.add.sprite(this.physics.world.bounds.width / 2 - 75, this.physics.world.bounds.height / 2 - 50, 'char_imam');
            char_imam.setScrollFactor(0);
            char_imam.depth = 50;
            char_imam.setInteractive({useHandCursor: true});
            char_imam.on('pointerover', function (event)
            {
                this.setTint(0xACACAC);
            });
            char_imam.on('pointerout', function (event)
            {
                this.clearTint();
            });
            char_imam.on('pointerup', function (event)
            {
                character_name = "player_imamoglu";
                sound_button.play();
                scene.startGame();
            });

            char_kilicdar = this.add.sprite(this.physics.world.bounds.width / 2 + 75, this.physics.world.bounds.height / 2 - 50, 'char_kilicdar');
            char_kilicdar.setScrollFactor(0);
            char_kilicdar.depth = 50;
            char_kilicdar.setInteractive({useHandCursor: true});
            char_kilicdar.on('pointerover', function (event)
            {
                this.setTint(0xACACAC);
            });
            char_kilicdar.on('pointerout', function (event)
            {
                this.clearTint();
            });
            char_kilicdar.on('pointerup', function (event)
            {
                character_name = "player_kilicdar";
                sound_button.play();
                scene.startGame();
            });


            char_atilla = this.add.sprite(this.physics.world.bounds.width / 2 + 75, this.physics.world.bounds.height / 2 + 80, 'char_hidden');
            char_atilla.setScrollFactor(0);
            char_atilla.depth = 50;
            char_atilla.setInteractive({useHandCursor: true});
            char_atilla.setTexture('char_atilla');
            char_atilla.on('pointerover', function (event)
            {
                this.setTint(0xACACAC);
            });
            char_atilla.on('pointerout', function (event)
            {
                this.clearTint();
            });
            char_atilla.on('pointerup', function (event)
            {
                character_name = "player_atilla";
                sound_button.play();
                scene.startGame();
            });

            char_yavas = this.add.sprite(this.physics.world.bounds.width / 2 - 75, this.physics.world.bounds.height / 2 + 80, 'char_yavas');
            char_yavas.setScrollFactor(0);
            char_yavas.depth = 50;
            char_yavas.setInteractive({useHandCursor: true});
            char_yavas.on('pointerover', function (event)
            {
                this.setTint(0xACACAC);
            });
            char_yavas.on('pointerout', function (event)
            {
                this.clearTint();
            });
            char_yavas.on('pointerup', function (event)
            {
                character_name = "player_yavas";
                sound_button.play();
                scene.startGame();
            });
        }

        this.startGame = function()
        {
            select_char.destroy();
            char_imam.destroy();
            char_kilicdar.destroy();
            char_atilla.destroy();
            char_yavas.destroy();
            nasil_button.destroy();
            group.clear(true);

            // play sound giana
            this.sound.add('giana').play({loop: false, volume:0.5});

            this.physics.world.gravity.y = gravity;

            map = this.make.tilemap({key: 'map'});

            this.physics.world.bounds.width = map.widthInPixels;
            this.physics.world.bounds.height = map.heightInPixels;

            var groundTiles = map.addTilesetImage('tiles');
            groundLayer = map.createStaticLayer('World', groundTiles, 0, 0);
            groundLayer.setCollisionByExclusion([-1]);
            groundLayer.depth = 1;

            sandiklar = this.add.group();
            gizliplatformlar = this.add.group();
            kafaplatformlar = this.add.group();
            kasalar = this.add.group();

            map.objects.forEach(function (obj)
            {
                obj.objects.forEach(function (e)
                {
                    if (e.name.search("sandik") > -1) // sandiklar
                    {
                        var sprite = this.physics.add.sprite(e.x, e.y, 'tiles', 7).setOrigin(0,1);
                        sprite.name = e.name;
                        sprite.depth = 2;
                        sprite.visible = e.visible;
                        sprite.body.immovable = true;
                        sprite.body.moves = false;
                        sprite.body.enable = e.visible;

                        sandiklar.add(sprite);
                    }
                    else if (e.name.search("gizliplatform") > -1) // gizli platformlar
                    {
                        var sprite = this.physics.add.sprite(e.x, e.y, 'tiles', 3).setOrigin(0,1);
                        sprite.name = e.name;
                        sprite.depth = 2;
                        sprite.visible = false;
                        sprite.body.immovable = true;
                        sprite.body.moves = false;
                        sprite.body.checkCollision.down = false;
                        sprite.body.checkCollision.left = false;
                        sprite.body.checkCollision.right = false;

                        gizliplatformlar.add(sprite);
                    }
                    else if (e.name.search("kafaplatform") > -1) // kafa atma platformlari
                    {
                        var sprite = this.physics.add.sprite(e.x, e.y, 'tiles', 0).setOrigin(0,1);
                        sprite.name = e.name;
                        sprite.depth = 2;
                        sprite.visible = true;
                        sprite.body.immovable = true;
                        sprite.body.moves = false;
                        sprite.sandik = e.type; // type yerine gorunur yapacagi sandik adi yazildi

                        kafaplatformlar.add(sprite);
                    }
                    else if (e.name.search("kasa") > -1) // tasinabilir kasalar
                    {
                        var sprite = this.physics.add.sprite(e.x, e.y, 'tiles', 14).setOrigin(0,1);
                        sprite.setBounce(0);
                        sprite.setCollideWorldBounds(true);
                        sprite.depth = 2;
                        sprite.body.maxVelocity.x = 200;
                        sprite.body.maxVelocity.y = 200;
                        sprite.body.setDragX(300);

                        kasalar.add(sprite);
                    }
                }.bind(this));
            }.bind(this));

            background = this.add.tileSprite(0, this.physics.world.bounds.height - 850, 10000, 1200, 'background').setOrigin(0, 0);
            background.depth = 0;
            background.setScrollFactor(0.5, 1);

            player = this.physics.add.sprite(player_start_x, this.physics.world.bounds.height - 200, character_name);
            player.setCollideWorldBounds(true);
            player.depth = 2;
            player.body.setSize(player.width - 50, player.height - 8, true);
            player.body.maxVelocity.x = 200;
            player.body.maxVelocity.y = 500;

            this.physics.add.collider(groundLayer, player);
            this.physics.add.collider(kasalar, player);
            this.physics.add.collider(groundLayer, kasalar);

            this.physics.add.collider(gizliplatformlar, player, function (platform, plyr)
            {
                if (plyr.y < platform.y - 90) // platformun altina kafa attiysa
                {
                    platform.visible = true;
                }
            }.bind(this));

            this.physics.add.collider(kafaplatformlar, player, function (platform, plyr)
            {
                if (plyr.y > platform.y + 30) // platformun ustundeyse
                {
                    platform.setTexture("tiles", 12); // isinin bittigini belirtmek icin frame'i degistiriliyor
                    sandiklar.children.iterate(function (sandik)
                    {
                        if (sandik.name == platform.sandik) 
                        {
                            sandik.body.enable = true;
                            sandik.visible = true;

                            // play sound pling
                            scene.sound.add('pling').play({loop: false, volume:0.5});
                        }
                    });
                }
            }.bind(this));

            this.physics.add.overlap(player, sandiklar, function (sprite, sandik)
            {
                sandiklar.remove(sandik, true); // true demessen display'den kaldirmaz

                score++;
                text.setText("Sandık: " + score + " / 39");

                oyfarki += 200;

                if (score >= 39)
                {
                    gameEnd();
                    return;
                }

                // stop all collect sounds
                for (var a in collectSounds)
                {
                    collectSounds[a].stop();
                }

                collectSounds[Math.floor(Math.random() * collectSounds.length)].play();
            }.bind(this));

            this.anims.anims.clear(); // bunu demessen karakter degismiyor

            this.anims.create({
                key: 'idle',
                frames:  this.anims.generateFrameNames(character_name, {prefix: 'sprite', start: 1, end: 4}), // [{key: 'player', frame: 'p1_stand'}],
                frameRate: 8,
                repeat: 0,
                yoyo: true
            });
            this.anims.create({
                key: 'walk',
                frames: this.anims.generateFrameNames(character_name, {prefix: 'sprite', start: 8, end: 11}),
                frameRate: 10,
                repeat: -1,
            });
            this.anims.create({
                key: 'jump',
                frames:  this.anims.generateFrameNames(character_name, {prefix: 'sprite', start: 14, end: 17}),
                frameRate: 3,
                repeat: 0
            });
            this.anims.create({
                key: 'crouch',
                frames:  this.anims.generateFrameNames(character_name, {prefix: 'sprite', start: 12, end: 13}),
                frameRate: 5,
                repeat: -1
            });
            this.anims.create({
                key: 'fire',
                frames:  this.anims.generateFrameNames(character_name, {prefix: 'sprite', start: 5, end: 7}),
                frameRate: 5,
                repeat: -1
            });

            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.startFollow(player);
            this.cameras.main.setBackgroundColor('#78c2ea');

            text = this.add.text(20, 20, '0', {
                fontFamily: 'Fresca',
                fontSize: ((this.sys.game.config.width < 500) ? '15px' : '30px'),
                fill: '#FFFF00',
                shadow: {
                    offsetX: 0,
                    offsetY: 3,
                    color: '#000',
                    blur: 2,
                    fill: true
                },
            });
            text.setScrollFactor(0); // text'i yerine sabitliyor
            text.depth = 3;
            text.setText("Sandık: " + score + " / 39");

            text2 = this.add.text(this.sys.game.config.width - ((this.sys.game.config.width < 500) ? 100 : 200), 20, '0', {
                fontFamily: 'Fresca',
                fontSize: ((this.sys.game.config.width < 500) ? '15px' : '30px'),
                fill: '#FF0000',
                shadow: {
                    offsetX: 0,
                    offsetY: 1,
                    color: '#000',
                    blur: 2,
                    fill: true
                },
            });
            text2.setScrollFactor(0); // text'i yerine sabitliyor
            text2.depth = 3;
            text2.setOrigin(0, 0);
            text2.setText("Oy Farkı: " + oyfarki);

            cursors = this.input.keyboard.createCursorKeys();

            collectSounds = [];
            if (character_name == "player_imamoglu")
            {
                collectSounds.push(this.sound.add('hak'));
                collectSounds.push(this.sound.add('ysk'));
                collectSounds.push(this.sound.add('aa'));
            }
            else if (character_name == "player_kilicdar")
            {
                collectSounds.push(this.sound.add('mac'));
                collectSounds.push(this.sound.add('istanbulu'));
                collectSounds.push(this.sound.add('boyle'));
            }
            else if (character_name == "player_atilla")
            {
                collectSounds.push(this.sound.add('cokelek'));
                collectSounds.push(this.sound.add('zennube'));
                collectSounds.push(this.sound.add('yamyam'));
                collectSounds.push(this.sound.add('yerim'));
            }
            else if (character_name == "player_yavas")
            {
                collectSounds.push(this.sound.add('adina'));
                collectSounds.push(this.sound.add('hudayda'));
                collectSounds.push(this.sound.add('darisi'));
            }

            backMusic = this.sound.add('music');
            backMusic.play({loop: true, volume:0.2});

            joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
                x: 80,
                y: this.sys.game.config.height - 60,
                radius: 50,
                base: this.add.graphics().fillStyle(0x888888).fillCircle(0, 0, 50),
                thumb: this.add.graphics().fillStyle(0xcccccc).fillCircle(0, 0,30),
                dir: '8dir',
                fixed: true,
                // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
                // forceMin: 16,
                // enable: true
            }).on('update', function ()
            {
                var s = 'Key down: ';
                for (var name in joycursors)
                {
                    if (joycursors[name].isDown) {
                        s += name + ' ';
                    }
                }
                s += '\n';
                s += ('Force: ' + Math.floor(joyStick.force * 100) / 100 + '\n');
                s += ('Angle: ' + Math.floor(joyStick.angle * 100) / 100 + '\n');

                //console.log(s);
            }, this);
            joyStick.base.depth = 5;
            joyStick.thumb.depth = 5;
            joycursors = joyStick.createCursorKeys();

            fireButton = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height - 60, "fireButton");
            fireButton.fire = false;
            fireButton.depth = 5;
            fireButton.setScrollFactor(0);
            fireButton.setInteractive();
            fireButton.on('pointerdown', function (event)
            {
                this.setScale(0.9);
                fireButton.fire = true;
            });
            fireButton.on('pointerup', function (event)
            {
                this.setScale(1);
                fireButton.fire = false;
            });
            fireButton.on('pointerover', function (event)
            {
                this.setTint(0xACACAC);
            });
            fireButton.on('pointerout', function (event)
            {
                this.setScale(1);
                this.clearTint();
                fireButton.fire = false;
            });

            playing = true;
        }

        this.successGame = function ()
        {
            var share_facebook = this.add.image(0, 0, 'share_facebook').setOrigin(0, 0.5);            
            share_facebook.x = 10;
            share_facebook.y = this.sys.game.config.height / 2;
            share_facebook.depth = 105;
            share_facebook.setScrollFactor(0);
            if (this.sys.game.config.width < 500) share_facebook.setScale(0.6);
            share_facebook.setInteractive({useHandCursor: true});
            share_facebook.on('pointerup', function (event)
            {
                shareFacebook(oyfarki);
            });

            var share_twitter = this.add.image(0, 0, 'share_twitter').setOrigin(1, 0.5);
            share_twitter.x = this.sys.game.config.width - 10;
            share_twitter.y = this.sys.game.config.height / 2;
            share_twitter.depth = 105;
            share_twitter.setScrollFactor(0);
            if (this.sys.game.config.width < 500) share_twitter.setScale(0.6);
            share_twitter.setInteractive({useHandCursor: true});
            share_twitter.on('pointerup', function (event)
            {
                shareTwitter(oyfarki);
            });

            var group = this.add.group();
            group.createMultiple({ key: 'raster', repeat: 32 });
            var hsv = Phaser.Display.Color.HSVColorWheel();
            var i = 0;
            var _this = this;
            group.children.iterate(function (child)
            {
                child.x = this.sys.game.config.width / 2;
                child.y = 0;
                child.depth = 32 - i;
                child.setScrollFactor(0);

                child.setTint(hsv[i * 10].color);

                i++;

                _this.tweens.add({
                    targets: child,
                    props: {
                        y: { value: 500, duration: 1500 },
                        scaleX: { value: child.depth / 64, duration: 6000, hold: 2000, delay: 2000 },
                        rotation: 1,
                    },
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                    delay: 32 * i
                });

            }.bind(this));

            if (character_name == "player_imamoglu")
            {
                var endMusic = this.sound.add('beyoglu');
                endMusic.play({loop: false, volume:0.6});

                var config = {
                    image: 'knighthawks',
                    width: 31,
                    height: 25,
                    chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
                    charsPerRow: 10,
                    spacing: { x: 1, y: 1 }
                };

                this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

                dynamic = this.add.dynamicBitmapText(0, 0, 'knighthawks', '                  MAZBATA IS IN ANOTHER CASTLE. TO BE CONTINUED...');
                dynamic.depth = 50;
                dynamic.setSize(this.sys.game.config.width, 100);
                dynamic.setScale(1);
                dynamic.setDisplayCallback(textCallback);
                dynamic.setScrollFactor(0);

                this.tweens.add({
                    targets: s,
                    duration: 500,
                    y: -10,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    yoyo: true
                });

                var end_image = this.add.image(0, 0, 'imamoglu_end');
                end_image.setScale(0.7);
                end_image.x = this.sys.game.config.width / 2;
                end_image.y = this.sys.game.config.height - end_image.displayHeight / 2;
                end_image.depth = 100;
                end_image.setScrollFactor(0); // text'i yerine sabitliyor

                function textCallback (data)
                {
                    data.y += 32 + s.y * Math.sin(data.index);
                    return data;
                }

                var txt = this.add.text(this.sys.game.config.width / 2, 130, '0', {
                    fontFamily: 'Fresca',
                    fontSize: ((this.sys.game.config.width < 500) ? '15px' : '30px'),
                    fill: '#FFFF00',
                    shadow: {
                        offsetX: 0,
                        offsetY: 3,
                        color: '#000',
                        blur: 2,
                        fill: true,
                    },
                });
                txt.setScrollFactor(0); // text'i yerine sabitliyor
                txt.depth = 100;
                txt.setOrigin(0.5);
                txt.setText("Tebrikler! " + oyfarki + " Oy Farkı İle Mazbatanızı Aldınız!");

                setInterval(function ()
                {
                    dynamic.scrollX += 1;
                    if (dynamic.scrollX > 2600)
                    {
                        dynamic.scrollX = 0;
                    }
                }, 10);
            }
            else if (character_name == "player_kilicdar")
            {
                var endMusic = this.sound.add('biz');
                endMusic.play({loop: false, volume:0.6});

                var config = {
                    image: 'knighthawks',
                    width: 31,
                    height: 25,
                    chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
                    charsPerRow: 10,
                    spacing: { x: 1, y: 1 }
                };

                this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

                dynamic = this.add.dynamicBitmapText(0, 0, 'knighthawks', '                          ELLER AYIRSA BILE BIZ AYRILAMAYIZ');
                dynamic.depth = 50;
                dynamic.setSize(this.sys.game.config.width, 100);
                dynamic.setScale(1);
                dynamic.setDisplayCallback(textCallback);
                dynamic.setScrollFactor(0);

                this.tweens.add({
                    targets: s,
                    duration: 500,
                    y: -10,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    yoyo: true
                });

                var end_image = this.add.image(0, 0, 'chair');
                end_image.setScale(0.7);
                end_image.x = this.sys.game.config.width / 2;
                end_image.y = this.sys.game.config.height - end_image.displayHeight / 2 - 50;
                end_image.depth = 100;
                end_image.setScrollFactor(0); // text'i yerine sabitliyor

                function textCallback (data)
                {
                    data.y += 32 + s.y * Math.sin(data.index);
                    return data;
                }

                var txt = this.add.text(this.sys.game.config.width / 2, 130, '0', {
                    fontFamily: 'Fresca',
                    fontSize: ((this.sys.game.config.width < 500) ? '15px' : '30px'),
                    fill: '#FFFF00',
                    shadow: {
                        offsetX: 0,
                        offsetY: 3,
                        color: '#000',
                        blur: 2,
                        fill: true,
                    },
                });
                txt.setScrollFactor(0); // text'i yerine sabitliyor
                txt.depth = 100;
                txt.setOrigin(0.5);
                txt.setText("Tebrikler! " + oyfarki + " Oy Farkı İle Koltuğa Sahip Çıktınız.");

                setInterval(function ()
                {
                    dynamic.scrollX += 1;
                    if (dynamic.scrollX > 2600)
                    {
                        dynamic.scrollX = 0;
                    }
                }, 10);
            }
            else if (character_name == "player_atilla")
            {
                var endMusic = this.sound.add('isengard');
                endMusic.play({loop: false, volume:0.6});

                var config = {
                    image: 'knighthawks',
                    width: 31,
                    height: 25,
                    chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
                    charsPerRow: 10,
                    spacing: { x: 1, y: 1 }
                };

                this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

                dynamic = this.add.dynamicBitmapText(0, 0, 'knighthawks', '                           EKREM KRALIM DAGI YAKIYORLAR!');
                dynamic.depth = 50;
                dynamic.setSize(this.sys.game.config.width, 100);
                dynamic.setScale(1);
                dynamic.setDisplayCallback(textCallback);
                dynamic.setScrollFactor(0);

                this.tweens.add({
                    targets: s,
                    duration: 500,
                    y: -10,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    yoyo: true
                });

                var end_image = this.add.image(0, 0, 'aragorn');
                end_image.setScale(0.7);
                end_image.x = this.sys.game.config.width / 2;
                end_image.y = this.sys.game.config.height - end_image.displayHeight / 2;
                end_image.depth = 100;
                end_image.setScrollFactor(0); // text'i yerine sabitliyor

                function textCallback (data)
                {
                    data.y += 32 + s.y * Math.sin(data.index);
                    return data;
                }

                var txt = this.add.text(this.sys.game.config.width / 2, 130, '0', 
                {
                    fontFamily: 'Fresca',
                    fontSize: ((this.sys.game.config.width < 500) ? '15px' : '30px'),
                    fill: '#FFFF00',
                    shadow: {
                        offsetX: 0,
                        offsetY: 3,
                        color: '#000',
                        blur: 2,
                        fill: true,
                    },
                });
                txt.setScrollFactor(0); // text'i yerine sabitliyor
                txt.depth = 100;
                txt.setOrigin(0.5);
                txt.setText("Tebrikler! " + oyfarki + " Oy Farkı İle Dağı Yaktınız.");

                setInterval(function ()
                {
                    dynamic.scrollX += 1;
                    if (dynamic.scrollX > 2600)
                    {
                        dynamic.scrollX = 0;
                    }
                }, 10);
            }
            else if (character_name == "player_yavas")
            {
                var endMusic = this.sound.add('hudayda2');
                endMusic.play({loop: false, volume:0.6});

                var config = {
                    image: 'knighthawks',
                    width: 31,
                    height: 25,
                    chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
                    charsPerRow: 10,
                    spacing: { x: 1, y: 1 }
                };

                this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

                dynamic = this.add.dynamicBitmapText(0, 0, 'knighthawks', '                           MANSUR YAVAS CIGERIMI SOKTUN!');
                dynamic.depth = 50;
                dynamic.setSize(this.sys.game.config.width, 100);
                dynamic.setScale(1);
                dynamic.setDisplayCallback(textCallback);
                dynamic.setScrollFactor(0);

                this.tweens.add({
                    targets: s,
                    duration: 500,
                    y: -10,
                    ease: 'Sine.easeInOut',
                    repeat: -1,
                    yoyo: true
                });

                this.anims.create({
                    key: 'dans',
                    frames: this.anims.generateFrameNumbers('dans', { start: 0, end: 30 }),
                    frameRate: 8,
                    repeat: -1,
                    yoyo: true
                });

                var end_image = this.add.sprite(0, 0, 'dans');
                end_image.setScale(1.3);
                end_image.x = this.sys.game.config.width / 2;
                end_image.y = this.sys.game.config.height - end_image.displayHeight / 2 - 20;
                end_image.depth = 100;
                end_image.setScrollFactor(0);

                end_image.anims.play('dans');

                function textCallback (data)
                {
                    data.y += 32 + s.y * Math.sin(data.index);
                    return data;
                }

                var txt = this.add.text(this.sys.game.config.width / 2, 130, '0',
                {
                    fontFamily: 'Fresca',
                    fontSize: ((this.sys.game.config.width < 500) ? '15px' : '30px'),
                    fill: '#FFFF00',
                    shadow: {
                        offsetX: 0,
                        offsetY: 3,
                        color: '#000',
                        blur: 2,
                        fill: true,
                    },
                });
                txt.setScrollFactor(0); // text'i yerine sabitliyor
                txt.depth = 100;
                txt.setOrigin(0.5);
                txt.setText("Tebrikler! " + oyfarki + " Oy Fark Attınız ama Mazbata Zaten Bende.");

                setInterval(function ()
                {
                    dynamic.scrollX += 1;
                    if (dynamic.scrollX > 2600)
                    {
                        dynamic.scrollX = 0;
                    }
                }, 10);
            }
        }
    }

    function gameEnd()
    {
        if (oyfarki > 0 && score >= 39)
        {
            playing = false;

            scene.cameras.main.setBackgroundColor('#000000');

            player.destroy();
            scene.children.getChildren().forEach(function (child)
            {
                child.destroy();
            });
            groundLayer.visible = false;
            joyStick.destroy();
            sandiklar.clear(true);
            kafaplatformlar.clear(true);
            gizliplatformlar.clear(true);
            kasalar.clear(true);
            text.destroy();
            text2.destroy();
            fireButton.destroy();

            scene.successGame();
        }
        else
        {
            oyfarki = 20141;
            score = 0;

            playing = false;

            scene.scene.restart();
        }

        backMusic.stop();
    }

    function update(time, delta)
    {
        try
        {
            if (playing)
            {
                oyfarki -= 1;
                text2.setText("Oy Farkı: " + Math.round(oyfarki));
                if (oyfarki <= 0) gameEnd();

                onFloor = Math.round(player.y) == onFloorVal;
                onFloorVal = Math.round(player.y);

                if (onFloorStrictVal.length >= 10) onFloorStrictVal.shift();
                onFloorStrictVal.push(Math.round(player.y));
                onFloorStrict = true;
                for (var i = 0 ; i < onFloorStrictVal.length ; i++)
                {
                    if (onFloorStrictVal[i] != Math.round(player.y))
                    {
                        onFloorStrict = false;
                    }
                }

                if (player.body.y > floor_y) player.body.setVelocityY(-500);

                if (cursors.space.isDown)
                {
                    if(onFloor)
                    {
                        player.anims.play('fire', true);
                        player.body.setVelocityX(0);
                    }
                }
                else if (cursors.down.isDown || joycursors.down.isDown)
                {
                    if(onFloor)
                    {
                        player.anims.play('crouch', true);
                        player.body.setVelocityX(0);
                    }
                }
                else if (cursors.left.isDown || joycursors.left.isDown)
                {
                    player.body.setVelocityX(-200);

                    if(onFloorStrict)
                    {
                        player.anims.play('walk', true);
                    }
                    else
                    {
                        player.anims.play('jump', true);
                    }
                    player.flipX = true;
                }
                else if (cursors.right.isDown || joycursors.right.isDown)
                {
                    player.body.setVelocityX(200);

                    if(onFloorStrict)
                    {
                        player.anims.play('walk', true);
                    }
                    else
                    {
                        player.anims.play('jump', true);
                    }
                    player.flipX = false;
                }
                else
                {
                    if(onFloorStrict)
                    {
                        player.anims.play('idle', true);
                    }
                    else
                    {
                        player.anims.play('jump', true);
                    }

                    player.body.setVelocityX(0);
                }

                // jump
                if ((cursors.up.isDown || joycursors.up.isDown || fireButton.fire) && onFloorStrict)
                {
                    player.body.setVelocityY(-400);
                }
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

    function SetCookie(name,value,hours)
    {
        var expire = "";
        expire = new Date((new Date()).getTime() + hours * 3600000);
        expire = "; expires=" + expire.toGMTString();
        document.cookie = name + "=" + escape(value) + expire;
        return true;
    }

    function GetCookie(name)
    {
        var cookieValue = "";
        var search = name + "=";
        if(document.cookie.length > 0)
        {
            offset = document.cookie.indexOf(search);
            if (offset != -1)
            {
                offset += search.length;
                end = document.cookie.indexOf(";", offset);
                if (end == -1) end = document.cookie.length; 
                cookieValue = unescape(document.cookie.substring(offset, end));
            }
        }
        return cookieValue;
    }

    function shareFacebook(val)
    {
        window.open("https://www.facebook.com/sharer/sharer.php?u=http://Mazbata.online&quote=Mazbata.online%20Oyununda%20"+val+"%20Oy%20Fark%C4%B1yla%20Mazbatam%C4%B1%20Ald%C4%B1m.%20Haydi%20sen%20de%20Oyna!", "_blank");
    }

    function shareTwitter(val)
    {
        window.open("http://www.twitter.com/share?text=Mazbata.online%20Oyununda%20"+val+"%20Oy%20Fark%C4%B1yla%20Mazbatam%C4%B1%20Ald%C4%B1m.%20Haydi%20sen%20de%20Oyna!&url=http://Mazbata.online&hashtags=mazbataonline,mazbata.online", "_blank");
    }

});