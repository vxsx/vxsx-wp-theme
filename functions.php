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

    //Disable wp3.1 admin bar http://wp-snippets.com/disable-wp-3-1-admin-bar/
    wp_deregister_script('admin-bar');
    wp_deregister_style('admin-bar');
    remove_action('wp_footer','wp_admin_bar_render',1000);

    //Disable visual editor http://wp-snippets.com/disable-the-visual-editor/
    add_filter('user_can_richedit' , create_function('' , 'return false;') , 50);
?>
