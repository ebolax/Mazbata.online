
$(function()
{
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
    var groundLayer, sandikLayer, objectsLayer;
    var text, text2;
    var score = 0;
    //score = 38;
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
    //oyfarki = 100;

    // ending
    var ending = false;
    var dynamic = null;
    var value = 0;
    var s = {
        y: 10
    };

    var character_name = "player_imamoglu";

    function preload()
    {

        this.load.tilemapTiledJSON('map', 'assets/map.json?v=1.0');

        this.load.spritesheet('tiles', 'assets/tiles.png?v=1.0', {frameWidth: 70, frameHeight: 70});

        this.load.image('sandik', 'assets/sandik.png?v=1.0');

        this.load.image('box', 'assets/box.png?v=1.0');

        this.load.image('intro_logo', 'assets/intro_logo.png?v=1.0');

        this.load.image('nasil_button', 'assets/nasil.png?v=1.0');

        this.load.image('startButton', 'assets/start.png?v=1.0');

        this.load.atlas('player_imamoglu', 'assets/imamoglu.png?v=1.0', 'assets/character.json');
        this.load.atlas('player_kilicdar', 'assets/kilicdaroglu.png?v=1.0', 'assets/character.json');
        this.load.atlas('player_atilla', 'assets/atilla.png?v=1.0', 'assets/character.json');

        this.load.image('background', 'assets/background.png?v=1.0');

        this.load.image('fireButton', 'assets/fireButton.png?v=1.0');

        this.load.audio('hak', ['snd/hak.mp3?v=1.0']);
        this.load.audio('ysk', ['snd/ysk.mp3?v=1.0']);
        this.load.audio('aa', ['snd/aa.mp3?v=1.0']);
        this.load.audio('music', 'snd/music.mp3?v=1.0');
        this.load.audio('izmir', 'snd/izmir.mp3?v=1.0');

        this.load.plugin('rexvirtualjoystickplugin', "js/rexvirtualjoystickplugin.min.js?v=1.0", true);

        this.load.image('knighthawks', 'assets/knight3.png?v=1.0');

        this.load.image('raster', 'assets/raster.png?v=1.0');

        this.load.image('imamoglu_end', 'assets/imamoglu_end.png?v=1.0');

        this.load.image('raster2', 'assets/raster-bw-64.png?v=1.0');
    }

    function create()
    {
        scene = this;

        var intro_logo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - 50, 'intro_logo');
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
        start_button.on('pointerdown', function (event)
        {

        });
        start_button.on('pointerup', function (event)
        {
            scene.startGame();
        });

        var nasil_button = this.add.image(this.physics.world.bounds.width / 2, this.physics.world.bounds.height - 50, 'nasil_button');
        if (this.sys.game.config.width < 500) nasil_button.setScale(0.6);
        nasil_button.setScrollFactor(0);
        nasil_button.depth = 50;
        nasil_button.setInteractive({useHandCursor: true});
        nasil_button.on('pointerup', function (event)
        {
            document.location = "#nasil";
        });

        this.startGame = function()
        {
            start_button.destroy();
            intro_logo.destroy();
            nasil_button.destroy();
            group.children.iterate(function (child)
            {
                if (child) child.destroy();
            });
            group.toggleVisible();

            this.physics.world.gravity.y = gravity;

            map = this.make.tilemap({key: 'map'});

            this.physics.world.bounds.width = map.widthInPixels;
            this.physics.world.bounds.height = map.heightInPixels;

            var groundTiles = map.addTilesetImage('tiles');
            groundLayer = map.createStaticLayer('World', groundTiles, 0, 0);
            groundLayer.setCollisionByExclusion([-1]);
            groundLayer.depth = 1;

            var sandikTiles = map.addTilesetImage('sandik');
            sandikLayer = map.createDynamicLayer('Sandiks', sandikTiles, 0, 0);
            sandikLayer.depth = 1;

            objectsLayer = this.add.group();
            map.objects[0].objects.forEach(function (e)
            {
                var boxSprite = this.physics.add.sprite(e.x, e.y, 'box');
                boxSprite.setBounce(0);
                boxSprite.setCollideWorldBounds(true);
                boxSprite.depth = 2;
                boxSprite.body.maxVelocity.x = 200;
                boxSprite.body.maxVelocity.y = 200;
                boxSprite.body.setDragX(300);

                objectsLayer.add(boxSprite);
            }.bind(this));

            background = this.add.tileSprite(0, this.physics.world.bounds.height - 1030, 10000, 1200, 'background').setOrigin(0, 0);
            background.depth = 0;

            player = this.physics.add.sprite(100, this.physics.world.bounds.height - 200, character_name);
            player.setCollideWorldBounds(true);
            player.depth = 2;
            player.body.setSize(player.width - 50, player.height - 8, true);
            player.body.maxVelocity.x = 200;
            player.body.maxVelocity.y = 500;

            this.physics.add.collider(groundLayer, player);
            this.physics.add.collider(objectsLayer, groundLayer);
            this.physics.add.collider(objectsLayer, player);

            this.physics.add.overlap(player, sandikLayer);
            sandikLayer.setTileIndexCallback(17, collectsandik, this);

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
            this.cameras.main.setBackgroundColor('#cee7f9');

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

            collectSounds.push(this.sound.add('hak'));
            collectSounds.push(this.sound.add('ysk'));
            collectSounds.push(this.sound.add('aa'));

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
            ending = true;

            var endMusic = this.sound.add('izmir');
            endMusic.play({loop: false, volume:0.5});

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
                        scaleX: { value: child.depth / 64, duration: 6000, hold: 2000, delay: 2000 }
                    },
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut',
                    delay: 32 * i
                });

            }.bind(this));

            var config = {
                image: 'knighthawks',
                width: 31,
                height: 25,
                chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
                charsPerRow: 10,
                spacing: { x: 1, y: 1 }
            };

            this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

            dynamic = this.add.dynamicBitmapText(0, 0, 'knighthawks', '                  MAZBATAMA ULASMAMDA BANA YARDIM ETTIGIN ICIN COK TESEKKURLER.');
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

            var imamoglu_end = this.add.image(0, 0, 'imamoglu_end');
            imamoglu_end.setScale(0.7);
            imamoglu_end.x = this.sys.game.config.width / 2;
            imamoglu_end.y = this.sys.game.config.height - imamoglu_end.displayHeight / 2;
            imamoglu_end.depth = 100;
            imamoglu_end.setScrollFactor(0); // text'i yerine sabitliyor

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
        }

        //this.startGame();
    }

    function end()
    {
        if (oyfarki > 0 && score >= 39)
        {
            console.log("win");

            playing = false;

            scene.cameras.main.setBackgroundColor('#000000');

            player.destroy();
            groundLayer.visible = false;
            objectsLayer.toggleVisible();
            sandikLayer.visible = false;
            background.visible = false;
            joyStick.destroy();
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

    function collectsandik(sprite, tile)
    {
        sandikLayer.removeTileAt(tile.x, tile.y);
        score++;
        text.setText("Sandık: " + score + " / 39");
        oyfarki += 200;

        //score = 39; // debug
        if (score >= 39)
        {
            end();
            return;
        }

        collectSounds[Math.floor(Math.random() * collectSounds.length)].play();
    }

    function update(time, delta)
    {
        try
        {
            if (playing)
            {
                oyfarki -= 1;
                text2.setText("Oy Farkı: " + Math.round(oyfarki));
                if (oyfarki <= 0) end();

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

            if (ending)
            {
                dynamic.scrollX += 0.15 * delta;
                if (dynamic.scrollX > 2600)
                {
                    dynamic.scrollX = 0;
                }
            }
        }
        catch (error)
        {
            console.log(error);
        }
    }

});