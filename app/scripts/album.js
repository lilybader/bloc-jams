
// Another Example Album
var albumMarconi = {
	name: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: '/images/album-placeholder.png',
	songs: [
		{ name: 'Hello, Operator?', length: '1:01' },
		{ name: 'Ring, ring, ring', length: '5:01' },
		{ name: 'Fits in your pocket', length: '3:21' },
		{ name: 'Can you hear me now?', length: '3:14' },
		{ name: 'Wrong phone number', length: '2:15' }
	]
};

// Third Example Album
var albumMixtape = {
	name: 'Rap Mixtape',
	artist: 'Various',
	label: 'ME',
	year: '2014',
	albumArtUrl: '/images/album-placeholder.png',
	songs: [
		{ name: 'No Diggity', length: '3:29' },
		{ name: 'Bubble Butt', length: '3:49' },
		{ name: 'Don\'t Touch Me', length: '3:34' },
		{ name: 'Booty Swing', length: '3:17' },
		{ name: 'Knockout', length: '4:09' }
	]
};

var currentlyPlayingSong = null;

function createSongRow(songNumber, songName, songLength) {
	var template =
			'<tr>'
		+ '  <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '</td>'
		+ '  <td class="col-md-9">' + songName + '</td>'
		+ '  <td class="col-md-2">' + songLength + '</td>'
		+ '</tr>'
		;

	// Instead of returning row immediately, attach hover functionality to it first
	var $row = $(template);

	var onHover = function(event) {
		var songNumberCell = $(this).find('.song-number');
		var songNumber = songNumberCell.data('song-number');
		if (songNumber !== currentlyPlayingSong) {
			songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
		}
	};

	var offHover = function(event) {
		var songNumberCell = $(this).find('.song-number');
		var songNumber = songNumberCell.data('song-number');
		if (songNumber !== currentlyPlayingSong) {
			songNumberCell.html(songNumber);
		}
	};

	// Toggle the play, pause, and song number based on the button clicked
	var clickHandler = function(event) {
		var songNumber = $(this).data('song-number');

		// if ( a song is playing ) {
		//   // Stop playing current song
		//   // Replace stopped song button with number
		// }

		// if ( a non-playing song was clicked ) {
		//   // A Play icon will be showing because of hover
		//   // Switch from Play -> Pause to indicate new song is playing
		//   // Set the current song to the one clicked
		// }
		// else if ( the playing song was clicked ) {
		//   // Switch from Pause -> Play for current song to indicate pausing
		//   // Set the current song to null
		// }

		if (currentlyPlayingSong !== null) {
			// Revert to song number for currently playing song because user started playing new song
			var currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
			currentlyPlayingCell.html(currentlyPlayingSong);
		}

		if (currentlyPlayingSong !== songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing
			$(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');
			currentlyPlayingSong = songNumber;
		}
		else if (currentlyPlayingSong === songNumber) {
			// Switch from Pause -> Play button to pause currently playing song
			$(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
			currentlyPlayingSong = null;
		}

	};

	$row.find('.song-number').click(clickHandler);
	$row.hover(onHover, offHover);
	return $row;
};

function changeAlbumView(album) {
	// Update the album title
	var $albumTitle = $('.album-title');
	$albumTitle.text(album.name);

	// Update the album artist
	var $albumArtist = $('.album-artist');
	$albumArtist.text(album.artist);

	// Update the meta information
	var $albumMeta = $('.album-meta-info');
	$albumMeta.text(album.year + " on " + album.label);

	// Update the album image
	var $albumImage = $('.album-image img');
	$albumImage.attr('src', album.albumArtUrl);

	// Update the song list
	var $songList = $('.album-song-listing');
	$songList.empty();
	var songs = album.songs;
	for (var i = 0; i < songs.length; i++) {
		var songData = songs[i];
		var $newRow = createSongRow(i + 1, songData.name, songData.length);
		$songList.append($newRow);
	}

};


// Seekbar control with mouse
function updateSeekPercentage($seekBar, event) {
	var barWidth = $seekBar.width();
	var offsetX = event.pageX - $seekBar.offset().left; // get mouse x offset here

	var offsetXPercent = (offsetX / barWidth) * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);

	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

// Attach seek bar updates to mouse events on bars
function setupSeekBars() {
	$seekBars = $('.player-bar .seek-bar');
	$seekBars.click(function(event) {
		updateSeekPercentage($(this), event);
	});

	$seekBars.find('.thumb').mousedown(function(event) {
		var $seekBar = $(this).parent();

		$seekBar.addClass('no-animate');

		$('.player-bar').bind('mousemove.thumb', function(event) {
			updateSeekPercentage($seekBar, event);
		});

		// cleanup
		$('.player-bar').bind('mouseup.thumb', function() {
			$seekBar.removeClass('no-animate');
			$('.player-bar').unbind('mousemove.thumb');
			$('.player-bar').unbind('mouseup.thumb');
		});
	});
};

// This 'if' condition is used to prevent the jQuery modifications
// from happening on non-Album view pages.
// - Use a regex to validate that the url has "/album" in its path.
if (document.URL.match(/\/album.html/)) {
// Wait until the HTML is fully processed
	$(document).ready(function() {

		changeAlbumView(albumPicasso);

		$('.col-md-3').click(function() {
			changeAlbumView(albumMixtape);
		});

		setupSeekBars();

		// track mouse movements
		// $(document).mousemove(function(e) {
		// 	var coordX = e.pageX;
		// 	var coordY = e.pageY;
		// 	console.log("(" + coordX + " , " + coordY + ")");
		// });

	});
};