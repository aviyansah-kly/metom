<?php get_header(); ?>
<main id="content" class="metom-article">
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
  <article>
    <header class="metom-article__header metom-shell">
      <p class="metom-kicker">Jurnal Metom</p>
      <h1><?php the_title(); ?></h1>
      <p class="metom-article__meta">Diperbarui <?php echo esc_html(get_the_modified_date('j F Y')); ?> · <?php echo esc_html(get_the_author()); ?></p>
      <?php if (has_excerpt()) : ?><div class="metom-article__lead"><?php the_excerpt(); ?></div><?php endif; ?>
    </header>
    <?php if (has_post_thumbnail()) : ?><div class="metom-shell metom-article__hero"><?php the_post_thumbnail('full'); ?></div><?php endif; ?>
    <div class="metom-shell metom-article__layout">
      <div class="metom-article__content">
        <?php the_content(); ?>
        <?php
        $service_id=(int)get_post_meta(get_the_ID(),'metom_related_service',true);
        $project_id=(int)get_post_meta(get_the_ID(),'metom_related_project',true);
        if(($service_id && get_post_status($service_id)==='publish') || ($project_id && get_post_status($project_id)==='publish')):
        ?>
          <section class="metom-related-content">
            <p class="metom-kicker">Lanjutkan eksplorasi</p>
            <div class="metom-related-content__grid">
              <?php if($service_id && get_post_status($service_id)==='publish'): ?>
                <a class="metom-related-card" href="<?php echo esc_url(get_permalink($service_id)); ?>">
                  <span>Layanan</span><strong><?php echo esc_html(get_the_title($service_id)); ?></strong>
                </a>
              <?php endif; ?>
              <?php if($project_id && get_post_status($project_id)==='publish'): ?>
                <a class="metom-related-card" href="<?php echo esc_url(get_permalink($project_id)); ?>">
                  <span>Project</span><strong><?php echo esc_html(get_the_title($project_id)); ?></strong>
                </a>
              <?php endif; ?>
            </div>
          </section>
        <?php endif; ?>
      </div>
      <aside class="metom-article__aside">
        <p class="metom-kicker">Butuh bantuan?</p>
        <h2>Konsultasikan kebutuhan interior Anda.</h2>
        <p>Jika artikel ini relevan dengan project Anda, diskusikan kebutuhan awal bersama Metom.</p>
        <a class="metom-button js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">Konsultasi via WhatsApp</a>
      </aside>
    </div>
  </article>
<?php endwhile; endif; ?>
</main>
<?php get_footer(); ?>
