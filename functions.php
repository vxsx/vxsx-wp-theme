<?php
/*
 * @package WordPress
 * @subpackage vxsx
 * @since vxsx 1.0
*/

	function ru_month_name( $month_name = null ) {
					$month_name_replace = array (
						"Январь" => "января",
						"Февраль" => "февраля",
						"Март" => "марта",
						"Апрель" => "апреля",
						"Май" => "мая",
						"Июнь" => "июня",
						"Июль" => "июля",
						"Август" => "августа",
						"Сентябрь" => "сентября",
						"Октябрь" => "октября",
						"Ноябрь" => "ноября",
						"Декабрь" => "декабря",
						"January" => "января",
						"February" => "февраля",
						"March" => "марта",
						"April" => "апреля",
						"May" => "мая",
						"June" => "июня",
						"July" => "июля",
						"August" => "августа",
						"September" => "сентября",
						"October" => "октября",
						"November" => "ноября",
						"December" => "декабря",
					);
					return strtr($month_name, $month_name_replace);
				}


?>