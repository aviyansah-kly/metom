</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div><a class="metom-footer-logo" href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php bloginfo('name'); ?>"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/brand/metom_logo.png'); ?>" alt="<?php echo esc_attr(get_bloginfo('name')); ?>"></a><p>Interior Design &amp; Build — Malang, Indonesia.</p></div>
    <div><?php wp_nav_menu(['theme_location'=>'footer','container'=>false,'fallback_cb'=>false]); ?></div>
    <div><a class="js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">WhatsApp</a></div>
  </div>
</footer>
<a class="wa-float js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener" aria-label="Konsultasi via WhatsApp"><span class="wa-label">Konsultasi WhatsApp</span></a>
<?php wp_footer(); ?>
</body>
</html>