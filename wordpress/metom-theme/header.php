<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header">
  <div class="wrap nav">
    <a class="logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php bloginfo('name'); ?>">
      <?php if (has_custom_logo()) { the_custom_logo(); } else { bloginfo('name'); } ?>
    </a>
    <nav aria-label="Navigasi utama">
      <?php wp_nav_menu(['theme_location'=>'primary','container'=>false,'menu_class'=>'navlinks','fallback_cb'=>false]); ?>
    </nav>
    <a class="enquire js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">Konsultasi</a>
  </div>
</header>
<main id="main-content">