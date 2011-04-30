<?php 
	if (!empty($_SERVER['SCRIPT_FILENAME']) && 'comments.php' == basename($_SERVER['SCRIPT_FILENAME']))
		die ('Please do not load this page directly. Thanks!');

	if ( post_password_required() ) { ?>
		<p class="nocomments"><?php _e('This post is password protected. Enter the password to view comments.', 'depo-squared'); ?></p>
	<?php
		return;
	}

#	$oddcomment = 'alt';
?>
<script type="text/javascript">
var os, k, submit;
	

$(function(){
	
	updatesubmit = function () {
      $('[type="submit"]').attr ('disabled', (
        (/^ *$/.test( $('#comment-name').val())  )  ||
        (/^ *$/.test( $('#comment-email').val()) ) ||
        (/^ *$/.test( $('#comment-text').val())  )
      ) ? 'disabled' : '')
	}	
  
	updatesubmit ()
 
	$('[required]').bind('input blur cut copy paste keypress', updatesubmit)
  


	os = $('.keyboard-shortcut').attr('data-os');

	$('#respond').stickyfloat({position: 'relative', duration: 0});
	
	$('#comment-text').keydown(function (event) {
		if ((13 == event.keyCode) && (os == 'win') && (!$('[type="submit"]').attr('disabled'))) { //or linux, but who cares :)
			//if (event.stopPropagation) event.stopPropagation ()
				if (event.ctrlKey) {
					$('#commentform').submit()
				}
		}

		if (os == 'mac') {
			if ((91 == event.keyCode) || (93 == event.keyCode)) { //left and right command
				k = 1;
			}
		}

		if ((13 == event.keyCode) && (os == 'mac') && ( k == 1 ) && (!$('[type="submit"]').attr('disabled'))) {
			$('#commentform').submit()
		}
	})

	$('#comment-text').keyup(function (event) {
		if ((91 == event.keyCode) || (93 == event.keyCode)) {
			k = 0;
		}
	})


})



</script>
<?php if ($comments) : ?>
<h2 class="comments">Комментарии:</h2>
<?php else: ?>
<h2 class="comments">Комментариев нет.</h2>
<?php endif; ?>



	<section id="comments" class="clearfix">
		<?php if ($comments) { ?>
		<section class="comments-wrap">		
		
			<?php foreach ($comments as $comment) { ?>
			<article class="comments">
			<footer><?php comment_author_link ()?><br><time style="font-size:0.8em">
				<?php 
					$current_year = date('y');
					$comment_year = get_comment_date('y');
//					_e("current: ".$current_year." / comment: ".$comment_year);




					if ($current_year == $comment_year)
					{
						comment_date('j ');
						_e(ru_month_name(get_comment_date("F")));
					}
					else
					{
						comment_date("j ");
						_e(ru_month_name(get_comment_date("F")));
						comment_date(" 'y");
					}

					_e(' в ');

					comment_time('H:m'); 

				?>
			</time></footer>
			<div id="comment-<?php comment_ID() ?>">
				
				<?php if ($comment->comment_approved == '0') : ?>
					<em>Ваш комментарий ожидает проверки.</em>
					<?php endif; ?>
					<?php comment_text() ?>
				
			</div>
			</article>
			<?php } ?>
		</section>
		<?php  } else { ?>
			<?php if ('open' == $post->comment_status) { ?>
				
				<p class="nocomments">Но вы вполне можете оставить их</p>
			<?php } else { ?>
				
				<p class="nevercomments">Комментарииев к данной записи нет и не будет.</p>
			<?php } ?>
		<?php } ?>		
		
		<?php if ('open' == $post->comment_status) { ?>
		<aside id="respond">
			<form action="<?php echo get_option(’siteurl’); ?>/wp-comments-post.php" method="post" id="commentform">
				<div class="subscribe">
					<?php show_subscription_checkbox(); ?>
				</div>
				<?php $current_user = wp_get_current_user(); 
				
				if ( 0 == $current_user->ID ) { ?>
					<div class="details">
						<input type="text" name="author" id="comment-name" class="text-input" value="<?php echo $comment_author; ?>" required>&nbsp;<label for="comment-name">Имя &bull;</label><br>
						<input type="email" name="email" id="comment-email" class="text-input" value="<?php echo $comment_author_email; ?>" placeholder="Опубликован не будет." required>&nbsp;<label for="comment-email">E-mail &bull;</label><br>
						<input type="url" name="url" id="comment-url" class="text-input" value="<?php echo $comment_author_url; ?>">&nbsp;<label for="comment-url">URL</label>
					</div>
					<textarea name="comment" id="comment-text" required></textarea>
					
					<input type="hidden" name="comment_post_ID" value="<?php echo $id; ?>">
				<?php } else { ?>
					<textarea name="comment" id="comment-text" required></textarea>
					<input type="hidden" name="comment_post_ID" value="<?php echo $id; ?>">
				<?php } ?>
				<?php do_action('comment_form', $post->ID); ?>
				<input type="submit" value="Отправить">
				<?php if ( stristr($_SERVER['HTTP_USER_AGENT'], 'Mac') ) { ?>
					<span class="keyboard-shortcut" data-os="mac">&#8984;&#x21a9;</span>
				<?php } else { ?>
					<span class="keyboard-shortcut" data-os="win">Ctrl + Enter</span>
				<?php } ?>
				<div class="rules">Все что не разрешено - запрещено, а разрешено немного - a, em, strong, blockquote. <!-- А все остальное мне до пизды, потому что я ебал этот ваш водпресс :(--></div>
			</form>
		</aside>
		<?php } ?>
	</section>
