<!DOCTYPE html>
<html lang="ru-RU">
	<meta charset="UTF-8">
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name='yandex-verification' content='44aad9e75dda00ab' />
	<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
	<link rel="shortcut icon" href="/favicon.ico">
	<link rel="apple-touch-icon" href="/wp-content/themes/vxsx/apple-touch-icon.png">
<!-- 	<link rel="apple-touch-startup-image" href="/wp-content/themes/vxsx/apple-touch-splash.png"> -->
	<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen">
	<!-- <link rel="stylesheet" media="handheld" href="handheld.css"> -->
	<title><?php 
			wp_title(); 
			if (function_exists('is_tag') and is_tag()) 
			{ 
				?>Tag Archive for <?php echo $tag; 
			} 
			if (is_archive()) { 
				?> archive<?php 
			} 
			elseif (is_search()) 
			{ 
				?> Search for <?php echo $s; 
			} 
			if ( !(is_404()) and (is_search()) or (is_single()) or (is_page()) or (function_exists('is_tag') and is_tag()) or (is_archive()) ) { ?> на <?php } ?> <?php bloginfo('name'); ?> <?#php bloginfo('description'); ?></title>
			
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script>
	<!-- <script>!window.jQuery && document.write('<script src="/wp-content/themes/vxsx/js/jquery.js"><\/script>')</script> -->
	<script src="/wp-content/themes/vxsx/js/modernizr-1.5.min.js"></script>

	<!-- или просто сделать криейт элемент -->
	
	<link rel="alternate" type="application/rss+xml" title="RSS 2.0" href="<?php bloginfo('rss2_url'); ?>" />
	<link rel="alternate" type="text/xml" title="RSS .92" href="<?php bloginfo('rss_url'); ?>" />
	<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="<?php bloginfo('atom_url'); ?>" />

	<link rel="pingback" href="<?php bloginfo(’pingback_url’); ?>" />
	
	<?php wp_head ();?>
</head>
<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->

	
	<div class="vxsx">
		<header class="blog-header">
			<h1><a href="/">Блог ни о чём</a></h1>
		</header>
		<section class="blog-posts clearfix">