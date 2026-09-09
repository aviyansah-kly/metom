<?php get_header(); ?>
<?php while (have_posts()) : the_post(); ?>
<article class="service-detail">
  <header class="service-hero wrap">
    <p class="kicker">Layanan Metom</p>
    <h1><?php the_title(); ?></h1>
    <?php if (has_excerpt()) : ?><p class="service-lead"><?php echo esc_html(get_the_excerpt()); ?></p><?php endif; ?>
  </header>
  <?php if (has_post_thumbnail()) : ?><div class="service-cover wrap"><?php the_post_thumbnail('full'); ?></div><?php endif; ?>
  <div class="service-content wrap"><?php the_content(); ?></div>
  <section class="service-projects wrap">
    <p class="kicker">Project terkait</p><h2>Hasil pekerjaan Metom</h2>
    <?php $projects=new WP_Query(['post_type'=>'metom_project','posts_per_page'=>3]); if($projects->have_posts()): ?><div class="project-grid"><?php while($projects->have_posts()):$projects->the_post(); ?><a class="project" href="<?php the_permalink(); ?>"><?php if(has_post_thumbnail()) the_post_thumbnail('large'); ?><div class="overlay"><strong><?php the_title(); ?></strong></div></a><?php endwhile; ?></div><?php wp_reset_postdata(); endif; ?>
  </section>
  <section class="cta"><div class="wrap"><h2>Diskusikan kebutuhan ruang Anda.</h2><a class="cta-link js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">Konsultasi WhatsApp</a></div></section>
</article>
<?php endwhile; ?>
<?php get_footer(); ?>