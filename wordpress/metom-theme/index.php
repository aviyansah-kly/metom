<?php
/**
 * Fallback template for Metom Design.
 */
get_header();
?>
<main id="main" class="site-main">
    <div class="wrap">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article <?php post_class(); ?>>
                    <h1><?php the_title(); ?></h1>
                    <?php the_content(); ?>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <p><?php esc_html_e('Content belum tersedia.', 'metom'); ?></p>
        <?php endif; ?>
    </div>
</main>
<?php
get_footer();
