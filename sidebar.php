<aside>
	<!--
	<img src="i/vxsx.jpg" alt="Вадим Сикора">
	<p class="copy"><a href="http://dashamayz.ru" target="_blank">&copy; Dasha Mayz</a></p>
	-->
	<p>Привет, меня зовут Вадим Сикора, я веб-технолог, живу в Москве и иногда пишу в этот блог, иногда что-то делаю на <a href="http://github.com/vxsx">гитхабе</a>. Подписывайтесь на <a href="/feed/">RSS</a></p>			
	<div id="last-tweet">
		<div class="arrow"></div>
		<div class="username"><a href="http://twitter.com/vxsx">vxsx</a></div>
	</div>
	
	
	
	<script id="tweets" type="text/x-jquery-tmpl">  
	    <div class="tweet">
	    	<p>{{html tweet}}</p>
	    	<time>${time}</time>
	    </div>  
	</script>  
	
	
	<script type="text/javascript">
	// функция для выбора 
	// верного набора названий временных отрезков
	function whichlabels (number) { 
		var c = number % 100;
		if(c > 6 && c < 21 ) return 0;//6 лет но 21 год и так далее
		else {
			c = (c % 10);
			if (c == 1) return 1;
			else if( c > 1 && c < 5) return 2;
			else return 0;
		};
	}
	
	function timeSince(postDate) { //postDate - unix timestamp
		var i, j, name, name2, seconds, seconds2, count, count2,
			chunks = [ // временные отрезки
				[60 * 60 * 24 * 365], //год
				[60 * 60 * 24 * 7], //неделя и так далее
				[60 * 60 * 24],
				[60 * 60],
				[1  * 60],
				[1  * 1]
			],
			labels = [
				[ 'лет',  'недель', 'дней', 'часов', 'минут',  'секунд'  ],
				[ 'год',  'неделя', 'день', 'час',   'минуту', 'секунду' ],
				[ 'года', 'недели', 'дня',  'часа',  'минуты', 'секунды' ]
			],
			today = Math.round(new Date().getTime() / 1000), //unix timestamp для сегодняшнего дня
			since = today - parseInt(postDate, 10); //временной отрезок в секундах который нам и нужно "перефразировать"
	
			for (i = 0, j = chunks.length; i < j; i++) 
			{
				seconds = chunks[i];
				
				if ((count = Math.floor(since / seconds)) != 0)  // находим наибольший целый временной отрезок, который нам подходит
				{
					name = labels[whichlabels(count)][i]; //находим для него подходящее название
					break;								  //и выходим из цикла
				}
			}
			
			print = count + ' ' + name; //заносим в искомую строку
			
			if (i + 1 < j - 1 ) //чтоб 	если первыми были выбраны минуты - кол-во секунд не показывать
			{
				seconds2 = chunks[i + 1]; //следующий временной отрезов
				
				//since - (seconds * count) - остаток после вычета первого отрезка
				if ((count2 = Math.floor((since - (seconds * count)) / seconds2)) != 0) 
				{
					name2 = labels[whichlabels(count2)][i+1];
					print += ' ' + count2 + ' ' + name2;
				}
			}
			
			print += " назад"; // :)
			return print;
	}
	
	$(function(){
			$.ajax({  
		        type : 'GET',  
		        dataType : 'jsonp',  
		        url : 'http://search.twitter.com/search.json?q=from:vxsx&rpp=1',  
		
		        success : function(tweets) {  
		           var twitter = $.map(tweets.results, function(obj, index) {  
		              return {  
		                 tweet : obj.text.replace(	/(^|\s)(?:#([\d\w_]+)|@([\d\w_]{1,15}))|(https?:\/\/[^\s"]+[\d\w_\-\/])|([a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gi,
									function( all, space, hashtag, username, link, email ) {
										var res = '<a href="mailto:' + email + '">' + email + "</a>";
										hashtag && (res = space + '<a href="http://search.twitter.com/search?q=%23' + hashtag + '">#' + hashtag + "</a>");
										username && (res = space + '<a href="http://twitter.com/' + username + '">@' + username + "</a>");
										link && (res = '<a href="' + encodeURI(decodeURI(link.replace(/<[^>]*>/g, ""))) + '">' + link + "</a>");
										return res;
									}
								),
		                 time : timeSince(new Date(obj.created_at).getTime()/1000)
		              };  
		           });  
		
		           $('#tweets').tmpl(twitter).appendTo('#last-tweet');
		        }
		     })  

	})
	
	</script>
</aside>

