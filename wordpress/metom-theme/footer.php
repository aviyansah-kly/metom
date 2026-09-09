</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div><strong><?php bloginfo('name'); ?></strong><p>Interior Design &amp; Build — Malang, Indonesia.</p></div>
    <div><?php wp_nav_menu(['theme_location'=>'footer','container'=>false,'fallback_cb'=>false]); ?></div>
    <div><a class="js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">WhatsApp</a></div>
  </div>
</footer>
<a class="wa-float js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener" aria-label="Konsultasi via WhatsApp"><span class="wa-label">Konsultasi WhatsApp</span></a>
<?php wp_footer(); ?>
</body>
</html>