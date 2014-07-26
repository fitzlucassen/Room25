<!DOCTYPE HTML>
<html>
    <head>
		<title>Room25 - Le jeu online</title>

		<?php
		    include("Partial/meta.php");
		?>
    </head>
    <body>
		<div id="global" ng-app="Room25App">
		    <header id="header">
				<h1>Room 25</h1>
		    </header>

		    <div id="game" ng-view>

		    </div>

		    <footer id="footer">
		    </footer>
		</div>
    </body>
</html>