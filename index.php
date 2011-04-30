<?php get_header(); ?>
<?php get_sidebar(); ?>
	<?php if (have_posts()) : echo('<section class="posts">'); while (have_posts()) : the_post(); ?>
		<article class="blog-post" id="<?php the_ID(); ?>">
			<header>
				<h2 class="name"><a href="<?php the_permalink() ?>" rel=”bookmark”><?php the_title(); ?></a></h2>
				<time>
					<?php 
						
						_e(get_the_date("j ") . ru_month_name(get_the_date("F")) . get_the_date(" Y") . " в " . get_the_time("H:i")); 
						
					?>
				</time>
			</header>
			<?php the_content(); ?>
			<footer>

				<p class="comments"><?php comments_popup_link('Комментариев нет', 'Комментариев: 1', 'Комментариев: %'); ?> <?php  edit_post_link('Редактировать',' / ',''); ?></p>
					
				
				<div class="social-buttons">
				<!--	<iframe src="http://www.facebook.com/plugins/like.php?href=<?php the_permalink() ?>&layout=button_count&locale=en_US&show_faces=true&width=450&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:100px; height:21px;" allowtransparency="true"></iframe>-->
					<a href="http://twitter.com/share" class="twitter-share-button"
				      data-url="<?php the_permalink() ?>"
				      data-text="<?php the_title(); ?>"
				      data-count="horizontal"
				      data-via="vxsx">Tweet</a>
				</div>
			</footer>
		</article>

		
		
	<?php endwhile; echo('</section>'); comments_template();  else: ?>
		<section class="posts">
			<article class="blog-post">
				<p class="error-page">Это не те дроиды,<br>которых ты ищешь</p>
			</article>
		</section>
	<?php endif;?>



<?php get_footer(); ?>
