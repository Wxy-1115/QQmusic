(function (window) {
    function Lyric(path) {
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        init: function (path) {
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        loadLyric: function(CallBack){
            $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) { 
                    // console.log(data);
                    $this.parseLyric(data)
                    CallBack();
                },
                error: function (e) {
                    console.log(e);
                }
            })
        },
        parseLyric: function(data){
            var $this = this;
            // 清空上一首歌曲的歌词和时间信息
            $this.times = []
            $this.lyrics = []
            var array = data.split("\n");
            // console.log(array);
            // 正则表达式 [00:00.92]
            var timeReg = /\[(\d*):(\d*\.\d*)\]/
            // 遍历每一条歌词
            $.each(array, function(index, ele){
                var lrc = ele.split("]")[1];
                if (lrc.length == 1) return true;
                // console.log(ele);
                var res = timeReg.exec(ele);
                // console.log(res);
                if(res == null) return true;
                var timeMin = parseInt(res[1] * 60);
                var timeSec = parseFloat(res[2]);
                var time = parseFloat((timeMin + timeSec).toFixed(2));
                // console.log(time);
                $this.times.push(time);
                $this.lyrics.push(lrc);
            })
        },
        currentIndex: function (currentTime){
            if(currentTime >= this.times[0]){
                this.index++;
                this.times.shift()
            }
            // console.log(this.index);
            // console.log(this.lyrics[this.index]);
            return this.index
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);