<?php get_header(); ?>
<?php while (have_posts()) : the_post(); ?>
<article class="project-detail wrap">
  <header class="project-detail__head">
    <p class="kicker"><?php echo esc_html(get_post_meta(get_the_ID(),'metom_location',true)); ?><?php $year=get_post_meta(get_the_ID(),'metom_year',true); if($year) echo ' · '.esc_html($year); ?></p>
    <h1><?php the_title(); ?></h1>
    <?php if (has_post_thumbnail()) : ?><div class="project-detail__hero"><?php the_post_thumbnail('full'); ?></div><?php endif; ?>
  </header>
  <div class="project-detail__body">
    <?php the_content(); ?>
    <?php
    $fields=['metom_scope'=>'Scope','metom_challenge'=>'Challenge','metom_solution'=>'Solusi','metom_materials'=>'Material','metom_duration'=>'Durasi'];
    foreach($fields as $key=>$label){$value=get_post_meta(get_the_ID(),$key,true);if($value){echo '<section class="project-fact"><h2>'.esc_html($label).'</h2><p>'.nl2br(esc_html($value)).'</p></section>';}}
    $testimonial=get_post_meta(get_the_ID(),'metom_testimonial',true); if($testimonial){echo '<blockquote>'.esc_html($testimonial).'</blockquote>';}
    ?>
  </div>
</article>
<?php endwhile; ?>
<?php get_footer(); ?>