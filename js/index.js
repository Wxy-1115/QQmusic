$(function () {
    // 0.自定义滚动条
    $(".content_list").mCustomScrollbar();
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    // 1.加载歌曲列表
    getPlayerList();
    function getPlayerList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                player.musicList = data;
                // 3.1遍历获取到的数据, 创建每一条音乐
                var $musicList = $(".content_list ul");
                $.each(data, function (index, ele) {
                    var $item = crateMusicItem(index, ele);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }
    // 2.初始化进度条
    initProgress();
    function initProgress(){
        var $music_progerss_bar = $(".music_progerss_bar");
        var $music_progerss_line = $(".music_progerss_line");
        var $music_progerss_dot = $(".music_progerss_dot");
        progress = new Progress($music_progerss_bar, $music_progerss_line, $music_progerss_dot);
        progress.progressCilck(function (value) {
            player.musicSeekTo(value)
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value)
        });

        var $music_voice_bar = $(".music_voice_bar");
        var $music_voice_line = $(".music_voice_line");
        var $music_voice_dot = $(".music_voice_dot");
        voiceProgress = new Progress($music_voice_bar, $music_voice_line, $music_voice_dot);
        voiceProgress.progressCilck(function (value) {
            player.musicVoliceSeekTo(value)
        });
        voiceProgress.progressMove(function (value) {
            player.musicVoliceSeekTo(value)
        });
    }
    // 3.初始化歌曲信息
    function initMusicInfo(music) {
        $(".song_info_pic img").attr("src", music.cover);
        $(".song_info_name a").text(music.name);
        $(".song_info_singer a").text(music.singer);
        $(".song_info_ablum a").text(music.album);
        $(".music_progress_name").text(music.name + " / " + music.singer);
        $(".music_progress_time").text("00:00" + " / " + music.time);
        $(".mask_bg").css("background", "url(" + music.cover + ")");
    }
    // 4.初始化歌词信息
    function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc)
        var $lryicContainer = $(".song_lyric")
        $lryicContainer.html("")
        lyric.loadLyric(function(){
            // 创建歌词列表
            $.each(lyric.lyrics, function(index, ele){
                var $item = $("<li>" +ele+ "</li>");
                $lryicContainer.append($item);
            })
        });
    }
    // 5.初始化事件监听
    initEvents();
    function initEvents() {
        // 1.监听歌曲的移入移出事件
        $(".content_list").delegate(".list_music", "mouseenter", function () {
            // 显示子菜单
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            // 隐藏时长
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music", "mouseleave", function () {
            // 隐藏子菜单
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            // 显示时长
            $(this).find(".list_time span").stop().fadeIn(100);
        });

        // 2.监听复选框的点击事件
        $(".content_list").delegate(".list_check", "click", function () {
            $(this).toggleClass("list_checked");
        });

        // 3.添加子菜单播放按钮的监听
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play", "click", function () {
            var $item = $(this).parents(".list_music");

            // console.log($item.get(0).index);
            // console.log($item.get(0).music);

            // 3.1切换播放图标
            $(this).toggleClass("list_menu_play2");
            // 3.2复原其它的播放图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            // 3.3同步底部播放按钮
            if ($(this).hasClass("list_menu_play2")) {
                // 当前子菜单的播放按钮是播放状态
                $musicPlay.addClass("music_play2");
                // 让文字高亮
                $item.find("div").css("color", "#fff");
                $item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
            } else {
                // 当前子菜单的播放按钮不是播放状态
                $musicPlay.removeClass("music_play2");
                // 让文字不高亮
                $item.find("div").css("color", "rgba(255,255,255,0.5)");
            }
            // 3.4切换序号的状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            // 3.5播放音乐
            player.playMusic($item.get(0).index, $item.get(0).music);
            // 3.6 切换歌曲信息
            initMusicInfo($item.get(0).music);
            // 3.7 切换歌词信息
            initMusicLyric($item.get(0).music)
        });
        // 4.监听底部控制区域播放按钮的点击
        $musicPlay.click(function () {
            // 判断有木有播放过音乐
            if (player.currentIndex == -1) {
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        // 5.监听底部控制区域上一首按钮的点击
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preindex()).find(".list_menu_play").trigger("click");
        });
        // 6.监听底部控制区域下一首按钮的点击 
        $(".music_next").click(function () {
            $(".list_music").eq(player.nextindex()).find(".list_menu_play").trigger("click");
        });
        // 7.监听删除按钮的点击
        $(".content_list").delegate(".list_menu_del", "click", function () {
            var $item = $(this).parents(".list_music");

            if ($item.get(0).index == player.currentIndex) {
                $(".music_next").trigger("click");
            }
            $item.remove();
            player.changeMusic($item.get(0).index);
            // 重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_number").text(index + 1);
            })
        });
        //8.监听播放的进度
        player.musicTimeUpdate(function (duration, currentTime, timeStr){
            // 同步时间
            if (isNaN(duration)) return
            $(".music_progress_time").text(timeStr);
            // 同步进度条
            // 计算相对比例
            value = currentTime / duration * 100;
            progress.setprogress(value)
            // 实现歌词的同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");

            if(index <= 2) return
            $(".song_lyric").css({
                marginTop: ((-index+2) * 30)
            })
        })
        //9.监听声音按钮的点击
        $(".music_voice_icon").click(function(){
            $(this).toggleClass("music_voice_icon2")
            if ($(this).attr("class").indexOf("music_voice_icon2") != -1){
                // 没有声音
                player.musicVoliceSeekTo(0);
            }else{ 
                player.musicVoliceSeekTo(1);
            }
        })
    }
    // 定义一个方法创建一条音乐
    function crateMusicItem(index, music) {
        var $item = $("" +
            "<li class=\"list_music\">\n" +
            "<div class=\"list_check\"><i></i></div>\n" +
            "<div class=\"list_number\">" + (index + 1) + "</div>\n" +
            "<div class=\"list_name\">" + music.name + "" +
            "     <div class=\"list_menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">" + music.singer + "</div>\n" +
            "<div class=\"list_time\">\n" +
            "     <span>" + music.time + "</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "</div>\n" +
            "</li>");

        $item.get(0).index = index;
        $item.get(0).music = music;

        return $item;
    }
});