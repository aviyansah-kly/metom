<?php get_header(); ?>
<main id="content" class="metom-archive">
  <section class="metom-section metom-section--alt">
    <div class="metom-shell">
      <p class="metom-kicker">Layanan</p>
      <h1>Layanan Interior Metom Design</h1>
      <p>Layanan desain interior, custom furniture, dan design & build untuk kebutuhan hunian maupun ruang komersial.</p>
      <div class="metom-card-grid">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <article class="metom-service-card">
            <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            <?php the_excerpt(); ?>
          </article>
        <?php endwhile; else : ?><p>Detail layanan sedang disiapkan.</p><?php endif; ?>
      </div>
      <?php the_posts_pagination(); ?>
    </div>
  </section>
</main>
<?php get_footer(); ?>
