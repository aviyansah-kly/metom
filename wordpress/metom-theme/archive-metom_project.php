<?php get_header(); ?>
<main id="content" class="metom-archive">
  <section class="metom-section">
    <div class="metom-shell">
      <p class="metom-kicker">Portfolio</p>
      <h1>Proyek Metom Design</h1>
      <p>Kumpulan proyek hunian, komersial, pendidikan, kantor, dan ruang lainnya yang telah ditangani Metom Design.</p>
      <div class="metom-card-grid metom-card-grid--projects">
        <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <article class="metom-card">
            <a href="<?php the_permalink(); ?>">
              <?php if (has_post_thumbnail()) { the_post_thumbnail('large', ['loading'=>'lazy']); } ?>
              <div class="metom-card__body">
                <p><?php echo esc_html(get_post_meta(get_the_ID(),'metom_location',true)); ?></p>
                <h2><?php the_title(); ?></h2>
                <?php the_excerpt(); ?>
              </div>
            </a>
          </article>
        <?php endwhile; else : ?><p>Portfolio sedang disiapkan.</p><?php endif; ?>
      </div>
      <?php the_posts_pagination(); ?>
    </div>
  </section>
</main>
<?php get_footer(); ?>
