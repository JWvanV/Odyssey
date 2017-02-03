/* jshint devel:true */
'use strict';
// global system;
var videoSystem;

function VideoSystem() {
    // look up/define all videos

    // allow for a little room, so we are not moving back and forth
    // setting it lower than 0.05 seems to result in issues in both FF and GC
    this.maxDrift = 0.05;
}

VideoSystem.prototype.setLevel = function(level) {

    var currentTime = 0;
    if (_.get(this, 'first')) {
        currentTime = this.first.currentTime;
    };

    var n  = Math.pow(2, level);

    $('#videos').empty();
    // create video elements
    for(var j = 0; j < n; j++) {
        for(var i = 0; i < n; i++) {
            var name = 'movies/cat_' + level + '_' + i + '_' + j + '.mp4';
            $('#videos').append(
                $('<video controls />')
                    .attr('src', name)
                    .addClass('level' + level)
            );
        }
    }

    this.videos = $('#videos video');
    this.first = _.head(this.videos);
    this.rest = _.slice(this.videos, 1);
    this.first.currentTime = currentTime;
};
VideoSystem.prototype.play = function () {
    // Play each video
    this.first.play();
}
VideoSystem.prototype.pause = function() {
    this.first.pause();
}
VideoSystem.prototype.sync = function() {
    var first = this.first;
    var maxDrift = this.maxDrift;
    // sync all status of videos to first
    _.each(this.rest, function(other) {
        // check all videos
        if (!(first.paused) && other.paused) {
            // it should have been started
            other.play();
        } else if (first.paused && !(other.paused)) {
            // it should have paused
            other.pause();
        } else if (Math.abs(other.currentTime - first.currentTime) > maxDrift) {
            // sync all times of videos to first
            other.currentTime = first.currentTime;
        }
    });
};

VideoSystem.prototype.keepInSync = function(){
    // request a new frame
    var system = this;
    function doSync() {
        requestAnimationFrame(doSync);
        system.sync();
    };
    // keep doing this....
    doSync();
};
(function(){
    videoSystem = new VideoSystem();
    videoSystem.setLevel(2);
    videoSystem.keepInSync();

    $('#play').on('click', function(){
        videoSystem.play();
    });

    // Pause all videos
    $('#pause').on('click', function(){
        videoSystem.pause();
    });
    //
    $('#sync').on('click', function(){
        videoSystem.sync();
    });
    $('#level-0').on('click', function(){
        videoSystem.setLevel(0);
    });
    $('#level-1').on('click', function(){
        videoSystem.setLevel(1);
    });
    $('#level-2').on('click', function(){
        videoSystem.setLevel(2);
    });

})();