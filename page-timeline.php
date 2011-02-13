<?php 
	/* Template Name: timeline */ 
	
	get_header();	
?>
<article id="page-timeline">
<h1 class="big-title">Об авторе.</h1>
<script type="text/javascript">
	$(function(){
		if (/opera/.test(navigator.userAgent.toLowerCase())) {
			$('body').addClass('opera') 
		};
	})
</script>
<?php if(have_posts()) : 	while (have_posts()) : the_post(); ?>
			<?php the_content() ?>
<?php endwhile; endif; //dunno ?>

	<script type="text/javascript">
		$(function(){
			//scroll to the linked
			if (!(/event\d+$/.test(window.location.hash)) )
			{
				window.location.hash = '';
			}
			var e = $('a[href='+((window.location.hash) ? window.location.hash : '#event6')+']');//element
			
			var y  = e.parent().children('span').text(),//year
				L  = parseInt(e.css('left')) +(360*parseInt(y-2005)), // ~ L
				w  = parseInt(e.width()),
				ww = $('.timeline-wrap').width(),
				x  = (e.hasClass('still')) ? L - ww + w + 100 : L - ((ww-w)/2);
			
			$('.handle').animate({	left: '-'+ x + 'px'	}, function(){ //should do the trick
				e.addClass('active');
				if (window.location.hash)
				{	
					$(window.location.hash).addClass('event-active').fadeIn();
				}
				else
				{
					$('#event6').addClass('event-active').fadeIn();
				}	
				
			});


			$('.event').bind('click touchend',function(e){ 
				e.preventDefault();
				var $this = $(this);
				window.location.hash = this.hash;
				if (!($this.hasClass('active'))) {
					$('.event').removeClass('active');
					$this.addClass('active');
					$('.event-active').fadeOut(function(){
						$('.event-active').removeClass('event-active');
						$(window.location.hash).addClass('event-active').fadeIn();				
					});
	
				}
			})
			
			var timeline = new Dragdealer('timeline',
			{
				loose: true,
			});

			
		//TODO: minify this
		})</script>

	<figure class="me">
			<img src="/wp-content/themes/vxsx/i/vxsx.jpg" id="img">
			<figcaption>Это я если что. by <a href="http://dashamayz.ru" rel="external nofollow">Dasha Mayz</a></figcaption>
	</figure>
	<section class="timeline-page">	
		<section class="about-me">
			<p>Привет, меня зовут Вадим Сикора, я веб-технолог и все то же самое что было написано в сайдбаре.</p>
			<p>Большинство информации обо мне можно почерпнуть из всевозможных социальных сетей, таких как <a href="http://facebook.com/vadim.sikora">Facebook<a>, <a href="http://vkontakte.ru/vadim_sikora">Вконтакте</a>, <a href="http://www.lastfm.ru/user/n0rb">Last.fm</a>, и, разумеется, <a href="http://twitter.com/vxsx">Twitter</a>.</p><p>Этот сайт - мой блог и мини-портфолио. Если у вас есть предложения для меня - пишите на <a href="mailto:hello@vxsx.ru">hello@vxsx.ru</a></p>
		</section>
		
		<section class="timeline-wrap dragdealer" id="timeline">
			<ul class="time handle">
				<li>
					<a class="event september months-32 line-1 event1" href="#event1">МГТУ им. Н.Э. Баумана</a>
					<span>2005</span>
				</li><!-- dumb 3px hack which isn't working because of wp compressor
				--><li>
					<span>2006</span>
				</li><!--
				--><li>
					<a class="event march months-6 line-3 event2" href="#event2">ЗАО Экоинвент</a>
					<span>2007</span>
				</li><!--
				--><li>
					<a class="event february months-14 line-2 event3" href="#event3">Утро.ру</a>
					<span>2008</span>
				</li><!--
				--><li>
					<a class="event october months-18 line-2 event4 still" href="#event4">ООО ИД "Медиамаркет"<i></i></a>
					<span>2009</span>
				</li><!--
				--><li>
					<a class="event august months-8 line-1 event5 still" href="#event5">iso100.ru<i></i></a>
					<a class="event september months-7 line-3 event6 still" href="#event6">vxsx.ru<i></i></a>
					<span>2010</span>
				</li><!-- 
				--><li>
					<span>2011</span>
				</li>
			</ul>
		</section>
		<div class="arrow"></div>	

		
		
			<section class="timeline-event-description">
				<article class="page-event" id="event1">
					<header>
						<h1>МГТУ им. Н.Э. Баумана</h1>
						<time>Сентябрь 2005 - Апрель 2008</time>
					</header>
					<p>Тут я просто учился лол</p>
				</article>
				
				<article class="page-event" id="event2">
					<header>
						<h1>ЗАО Экоинвент</h1>
						<time>Март 2007 - Август 2007</time>
					</header>
						<dl>
							<dt>Должность</dt>
							<dd>Специалист отдела поддержки и развития клиентских баз данных</dd>
						</dl>
						<p>Информационный центр компании Майкрософт, где я работал оператором и сидел на телефоне тупо больше ничего не делая.</p>

				</article>
				
				<article class="page-event" id="event3">
					<header>
						<h1>Утро.ру (ИПК Медиа Продакшн)</h1>
						<time>Февраль 2008 - Март 2009</time>
					</header>
						<dl class="event-info">
							<dt>Должность</dt>
							<dd>Дизайнер-Верстальщик</dd>
							<dt>Сайты</dt>
							<dd><a href="http://tourdaily.ru">tourdaily.ru</a></dd>
							<dd><a href="http://auto.utro.ru">auto.utro.ru</a></dd>
							<dd><a href="http://utro.ru">utro.ru</a></dd>
						</dl>
						<p>
							Отрисовка баннеров, верстка дополнительных разделов сайта и поддержка их, также верстка промо-страниц, поиск фотографий в интернете, наполнение иллюстрациями новостной ленты сайта (tourdaily.ru, auto.utro.ru, utro.ru)
						</p>

				</article>
				
				<article class="page-event" id="event4">
					<header>
						<h1>ООО ИД "Медиамаркет"</h1>
						<time>Сентябрь 2009 - ...</time>
					</header>
					<dl class="event-info">
							<dt>Должность</dt>
							<dd>Веб-технолог</dd>
							<dt>Сайты</dt>
							<dd><a href="http://club-sale.ru">club-sale.ru</a></dd>
							<dd><a href="http://blackfriday.ru">blackfriday.ru</a></dd>
							<dd><a href="http://ochkov.net">ochkov.net</a></dd>
							<dd><a href="http://mediamarketholding.ru">mediamarketholding.com</a></dd>
							<dd><a href="http://gainsbrook.ch">gainsbrook.ch</a></dd>
						</dl>
						<p>
							Очень много всего с версткой и яваскриптом. Должны быть скриншоты того, что я сделал для админки.
						</p>
				</article>
				
				<article class="page-event" id="event5">
					<header>
						<h1>iso100.ru</h1>
						<time>Август 2005 - ...</time>
					</header>
					<p>Внештатный верстальщик. Полным ходом идет переработка проекта под современные технические реалии господи какую же хуйню я пишу иногда, а.</p>
				</article>
				
				<article class="page-event" id="event6">
					<header>
						<h1>vxsx.ru</h1>
						<time>Сентябрь 2010 - ...</time>
					</header>
					<p>Собственно вот этот бложек, который является и портфолио и песочницей. Я не дизайнер, поэтому что вышло то вышло. Существуют также оптимизированные версии под мобильные устройства, а также iPhone и iPad.</p>
				</article>
			</section>
		</section>
</article>

<?php get_footer(); ?>


<?php //test ?>