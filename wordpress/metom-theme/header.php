<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/png" href="<?php echo esc_url(get_template_directory_uri() . '/assets/brand/metom_fav.png'); ?>">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
  <div class="wrap nav">
    <a class="logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php bloginfo('name'); ?>">
      <?php if (has_custom_logo()) { the_custom_logo(); } else { ?><img class="metom-brand-logo" src="<?php echo esc_url(get_template_directory_uri() . '/assets/brand/metom_logo.png'); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>"><?php } ?>
    </a>
    <nav class="wp-primary-nav" id="wpPrimaryNav" aria-label="Navigasi utama">
      <?php wp_nav_menu(['theme_location'=>'primary','container'=>false,'menu_class'=>'navlinks','fallback_cb'=>false]); ?>
    </nav>
    <a class="enquire js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">Konsultasi</a>
    <button class="wp-mobile-toggle" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="wpPrimaryNav"><span></span></button>
  </div>
</header>