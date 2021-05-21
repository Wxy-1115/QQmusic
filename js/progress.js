(function (window) {
    function Progress($music_progerss_bar, $music_progerss_line, $music_progerss_dot) {
        return new Progress.prototype.init($music_progerss_bar, $music_progerss_line, $music_progerss_dot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($music_progerss_bar, $music_progerss_line, $music_progerss_dot) {
            this.$music_progerss_bar = $music_progerss_bar;
            this.$music_progerss_line = $music_progerss_line;
            this.$music_progerss_dot = $music_progerss_dot;
        },
        isMove: false,
        progressCilck: function(Callback){
            var $this = this;
            this.$music_progerss_bar.click(function(event){
                var normalleft = $(this).offset().left;
                var eventLeft = event.pageX;
                $this.$music_progerss_line.css("width", (eventLeft-normalleft))
                $this.$music_progerss_dot.css("left", (eventLeft-normalleft-7))
                // 计算进度条宽度
                var value = (eventLeft - normalleft) / $(this).width()
                Callback(value)
            });
        },
        progressMove: function (Callback){
            var $this = this;
            var eventLeft;
            var normalleft;
            this.$music_progerss_bar.mousedown(function(){
                $this.isMove = true;
                normalleft = $(this).offset().left;
                var nomalWidth = parseInt($(this).css("width"));
                var max = normalleft + nomalWidth;
                $(document).mousemove(function(event){
                    eventLeft = event.pageX;
                    if(eventLeft > normalleft && eventLeft < max){
                        $this.$music_progerss_line.css("width", (eventLeft-normalleft))
                        $this.$music_progerss_dot.css("left", (eventLeft-normalleft-7))
                    }
                });
            });
            $(document).mouseup(function (){
                $(document).off("mousemove");
                // 计算进度条宽度
                var value = (eventLeft - normalleft) / $this.$music_progerss_bar.width()
                Callback(value)
                $this.isMove = false;
            });
        },
        setprogress: function(value){
            if(this.isMove) return;
            if(value<0 || value>100) return;
            this.$music_progerss_line.css({
                width: value + "%"
            })
            this.$music_progerss_dot.css({
                left: value+ "%"
            })
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);