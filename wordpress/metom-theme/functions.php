<?php
/**
 * Metom Design theme setup.
 */
if (!defined('ABSPATH')) { exit; }

function metom_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption','style','script']);
    add_theme_support('custom-logo');
    add_theme_support('responsive-embeds');
    register_nav_menus(['primary'=>__('Primary Navigation','metom'),'footer'=>__('Footer Navigation','metom')]);
}
add_action('after_setup_theme','metom_setup');

function metom_assets() {
    wp_enqueue_style('metom-style',get_stylesheet_uri(),[],wp_get_theme()->get('Version'));
    wp_register_script('metom-tracking','',[],null,true);
    wp_enqueue_script('metom-tracking');
    wp_add_inline_script('metom-tracking',"document.addEventListener('click',function(e){var a=e.target.closest('.js-wa-track');if(a&&typeof window.gtag==='function'){window.gtag('event','whatsapp_click',{event_category:'lead',link_url:a.href});}var t=e.target.closest('.wp-mobile-toggle');if(t){document.body.classList.toggle('wp-mobile-open');t.setAttribute('aria-expanded',document.body.classList.contains('wp-mobile-open')?'true':'false');}if(e.target.closest('.navlinks a')){document.body.classList.remove('wp-mobile-open');var b=document.querySelector('.wp-mobile-toggle');if(b)b.setAttribute('aria-expanded','false');}});");
}
add_action('wp_enqueue_scripts','metom_assets');

function metom_whatsapp_url() {
    $number = preg_replace('/\D+/','',(string)get_theme_mod('metom_whatsapp_number','6281231131796'));
    return 'https://wa.me/'.$number.'?text='.rawurlencode('Halo Metom, saya ingin konsultasi mengenai kebutuhan interior.');
}

function metom_customize_register($wp_customize) {
    $wp_customize->add_section('metom_contact',['title'=>__('Metom Contact','metom'),'priority'=>30]);
    $wp_customize->add_setting('metom_whatsapp_number',['default'=>'6281231131796','sanitize_callback'=>'sanitize_text_field']);
    $wp_customize->add_control('metom_whatsapp_number',['label'=>__('WhatsApp Number','metom'),'section'=>'metom_contact','type'=>'text']);
}
add_action('customize_register','metom_customize_register');

function metom_register_content_types() {
    register_post_type('metom_project',[
        'labels'=>['name'=>__('Projects','metom'),'singular_name'=>__('Project','metom'),'add_new_item'=>__('Add New Project','metom'),'edit_item'=>__('Edit Project','metom')],
        'public'=>true,'show_in_rest'=>true,'menu_icon'=>'dashicons-format-gallery','has_archive'=>'proyek','rewrite'=>['slug'=>'proyek','with_front'=>false],
        'supports'=>['title','editor','thumbnail','excerpt','revisions'],
    ]);
    register_taxonomy('project_category',['metom_project'],[
        'labels'=>['name'=>__('Project Categories','metom'),'singular_name'=>__('Project Category','metom')],
        'public'=>true,'show_in_rest'=>true,'hierarchical'=>true,'rewrite'=>['slug'=>'kategori-proyek','with_front'=>false],
    ]);
    register_post_type('metom_service',[
        'labels'=>['name'=>__('Services','metom'),'singular_name'=>__('Service','metom'),'add_new_item'=>__('Add New Service','metom'),'edit_item'=>__('Edit Service','metom')],
        'public'=>true,'show_in_rest'=>true,'menu_icon'=>'dashicons-admin-tools','has_archive'=>'layanan','rewrite'=>['slug'=>'layanan','with_front'=>false],
        'supports'=>['title','editor','thumbnail','excerpt','revisions'],
    ]);
    register_post_type('metom_client',[
        'labels'=>['name'=>__('Clients','metom'),'singular_name'=>__('Client','metom'),'add_new_item'=>__('Add New Client','metom'),'edit_item'=>__('Edit Client','metom')],
        'public'=>false,'show_ui'=>true,'show_in_rest'=>true,'menu_icon'=>'dashicons-building','supports'=>['title','thumbnail','page-attributes'],
    ]);
}
add_action('init','metom_register_content_types');

function metom_register_meta_fields() {
    $project_fields=['metom_location','metom_year','metom_scope','metom_challenge','metom_solution','metom_materials','metom_duration','metom_testimonial','metom_gallery_ids','metom_service_id'];
    foreach($project_fields as $field){
        register_post_meta('metom_project',$field,['type'=>'string','single'=>true,'show_in_rest'=>true,'sanitize_callback'=>'sanitize_textarea_field','auth_callback'=>static function(){return current_user_can('edit_posts');}]);
    }
    register_post_meta('post','metom_related_service',['type'=>'string','single'=>true,'show_in_rest'=>true,'sanitize_callback'=>'absint','auth_callback'=>static function(){return current_user_can('edit_posts');}]);
    register_post_meta('post','metom_related_project',['type'=>'string','single'=>true,'show_in_rest'=>true,'sanitize_callback'=>'absint','auth_callback'=>static function(){return current_user_can('edit_posts');}]);
}
add_action('init','metom_register_meta_fields');

function metom_project_meta_box() {
    add_meta_box('metom_project_details',__('Project Details','metom'),'metom_project_meta_box_html','metom_project','normal','high');
    add_meta_box('metom_project_gallery',__('Project Gallery','metom'),'metom_project_gallery_box_html','metom_project','normal','default');
    add_meta_box('metom_article_relationships',__('Metom Content Relationships','metom'),'metom_article_relationships_html','post','side','default');
}
add_action('add_meta_boxes','metom_project_meta_box');

function metom_service_options($selected=0) {
    $services=get_posts(['post_type'=>'metom_service','post_status'=>'publish','numberposts'=>-1,'orderby'=>'title','order'=>'ASC']);
    echo '<option value="">— Tidak dipilih —</option>';
    foreach($services as $service){echo '<option value="'.esc_attr($service->ID).'" '.selected((int)$selected,$service->ID,false).'>'.esc_html($service->post_title).'</option>';}
}

function metom_project_options($selected=0) {
    $projects=get_posts(['post_type'=>'metom_project','post_status'=>'publish','numberposts'=>-1,'orderby'=>'title','order'=>'ASC']);
    echo '<option value="">— Tidak dipilih —</option>';
    foreach($projects as $project){echo '<option value="'.esc_attr($project->ID).'" '.selected((int)$selected,$project->ID,false).'>'.esc_html($project->post_title).'</option>';}
}

function metom_project_meta_box_html($post) {
    wp_nonce_field('metom_project_meta_save','metom_project_meta_nonce');
    $fields=[
        'metom_location'=>'Lokasi','metom_year'=>'Tahun','metom_scope'=>'Scope Pekerjaan','metom_challenge'=>'Challenge',
        'metom_solution'=>'Solusi Metom','metom_materials'=>'Material Utama','metom_duration'=>'Durasi','metom_testimonial'=>'Testimonial',
    ];
    echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">';
    foreach($fields as $key=>$label){
        $value=get_post_meta($post->ID,$key,true);
        $wide=in_array($key,['metom_scope','metom_challenge','metom_solution','metom_testimonial'],true);
        echo '<p style="margin:0;'.($wide?'grid-column:1/-1':'').'">';
        echo '<label for="'.esc_attr($key).'" style="display:block;font-weight:600;margin-bottom:6px">'.esc_html($label).'</label>';
        if($wide){echo '<textarea style="width:100%;min-height:90px" id="'.esc_attr($key).'" name="'.esc_attr($key).'">'.esc_textarea($value).'</textarea>';}
        else{echo '<input style="width:100%" type="text" id="'.esc_attr($key).'" name="'.esc_attr($key).'" value="'.esc_attr($value).'">';}
        echo '</p>';
    }
    $service_id=(int)get_post_meta($post->ID,'metom_service_id',true);
    echo '<p style="grid-column:1/-1;margin:0"><label style="display:block;font-weight:600;margin-bottom:6px" for="metom_service_id">Layanan Terkait</label><select style="width:100%" id="metom_service_id" name="metom_service_id">';
    metom_service_options($service_id);
    echo '</select></p></div>';
}

function metom_project_gallery_box_html($post) {
    $ids=get_post_meta($post->ID,'metom_gallery_ids',true);
    echo '<p>Tambahkan foto final, detail, before/after, atau proses. Urutan ID mengikuti urutan pemilihan media.</p>';
    echo '<input type="hidden" id="metom_gallery_ids" name="metom_gallery_ids" value="'.esc_attr($ids).'">';
    echo '<div id="metom_gallery_preview" style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:12px 0">';
    foreach(array_filter(array_map('absint',explode(',',$ids))) as $id){echo wp_get_attachment_image($id,'thumbnail',false,['style'=>'width:100%;height:90px;object-fit:cover']);}
    echo '</div><button type="button" class="button button-primary" id="metom_gallery_select">Pilih / Edit Gallery</button> <button type="button" class="button" id="metom_gallery_clear">Kosongkan</button>';
}

function metom_article_relationships_html($post) {
    wp_nonce_field('metom_article_rel_save','metom_article_rel_nonce');
    $service=(int)get_post_meta($post->ID,'metom_related_service',true);
    $project=(int)get_post_meta($post->ID,'metom_related_project',true);
    echo '<p><label for="metom_related_service"><strong>Layanan terkait</strong></label><br><select style="width:100%" id="metom_related_service" name="metom_related_service">';metom_service_options($service);echo '</select></p>';
    echo '<p><label for="metom_related_project"><strong>Project terkait</strong></label><br><select style="width:100%" id="metom_related_project" name="metom_related_project">';metom_project_options($project);echo '</select></p>';
}

function metom_admin_media($hook) {
    global $post;
    if(!in_array($hook,['post.php','post-new.php'],true) || !$post || $post->post_type!=='metom_project') return;
    wp_enqueue_media();
    wp_register_script('metom-admin-gallery','', ['jquery'], null, true); wp_enqueue_script('metom-admin-gallery');
    wp_add_inline_script('metom-admin-gallery',"jQuery(function($){var frame;$('#metom_gallery_select').on('click',function(e){e.preventDefault();if(frame){frame.open();return;}frame=wp.media({title:'Pilih foto project',button:{text:'Gunakan foto'},multiple:true});frame.on('select',function(){var a=frame.state().get('selection').toJSON(),ids=[],html='';a.forEach(function(x){ids.push(x.id);var src=x.sizes&&x.sizes.thumbnail?x.sizes.thumbnail.url:x.url;html+='<img src=\"'+src+'\" style=\"width:100%;height:90px;object-fit:cover\">';});$('#metom_gallery_ids').val(ids.join(','));$('#metom_gallery_preview').html(html);});frame.open();});$('#metom_gallery_clear').on('click',function(){ $('#metom_gallery_ids').val('');$('#metom_gallery_preview').empty();});});");
}
add_action('admin_enqueue_scripts','metom_admin_media');

function metom_save_project_meta($post_id) {
    if(!isset($_POST['metom_project_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['metom_project_meta_nonce'])),'metom_project_meta_save')) return;
    if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if(!current_user_can('edit_post',$post_id)) return;
    $fields=['metom_location','metom_year','metom_scope','metom_challenge','metom_solution','metom_materials','metom_duration','metom_testimonial'];
    foreach($fields as $field){if(isset($_POST[$field])) update_post_meta($post_id,$field,sanitize_textarea_field(wp_unslash($_POST[$field])));}
    if(isset($_POST['metom_service_id'])) update_post_meta($post_id,'metom_service_id',absint($_POST['metom_service_id']));
    if(isset($_POST['metom_gallery_ids'])){
        $ids=array_filter(array_map('absint',explode(',',sanitize_text_field(wp_unslash($_POST['metom_gallery_ids'])))));
        update_post_meta($post_id,'metom_gallery_ids',implode(',',$ids));
    }
}
add_action('save_post_metom_project','metom_save_project_meta');

function metom_save_article_relationships($post_id) {
    if(!isset($_POST['metom_article_rel_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['metom_article_rel_nonce'])),'metom_article_rel_save')) return;
    if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if(!current_user_can('edit_post',$post_id)) return;
    foreach(['metom_related_service','metom_related_project'] as $field){if(isset($_POST[$field])) update_post_meta($post_id,$field,absint($_POST[$field]));}
}
add_action('save_post_post','metom_save_article_relationships');

function metom_admin_columns($columns) {
    $new=[]; foreach($columns as $key=>$label){$new[$key]=$label;if($key==='title'){$new['metom_location']=__('Location','metom');$new['metom_year']=__('Year','metom');$new['metom_service_id']=__('Service','metom');}} return $new;
}
add_filter('manage_metom_project_posts_columns','metom_admin_columns');
function metom_admin_column_content($column,$post_id){
    if(in_array($column,['metom_location','metom_year'],true)) echo esc_html(get_post_meta($post_id,$column,true));
    if($column==='metom_service_id'){ $id=(int)get_post_meta($post_id,'metom_service_id',true); if($id) echo esc_html(get_the_title($id)); }
}
add_action('manage_metom_project_posts_custom_column','metom_admin_column_content',10,2);

function metom_has_seo_plugin() {
    return defined('WPSEO_VERSION') || defined('RANK_MATH_VERSION') || defined('AIOSEO_VERSION');
}

function metom_schema_output() {
    if(metom_has_seo_plugin()) return;
    $data=null;
    if(is_front_page()){
        $data=['@context'=>'https://schema.org','@type'=>'InteriorDesigner','name'=>get_bloginfo('name'),'url'=>home_url('/'),'telephone'=>get_theme_mod('metom_whatsapp_number','6281231131796'),'areaServed'=>['Malang','Batu','Jawa Timur']];
    }elseif(is_singular('post')){
        $data=['@context'=>'https://schema.org','@type'=>'Article','headline'=>get_the_title(),'datePublished'=>get_the_date(DATE_W3C),'dateModified'=>get_the_modified_date(DATE_W3C),'mainEntityOfPage'=>get_permalink(),'author'=>['@type'=>'Organization','name'=>'Metom Design'],'publisher'=>['@type'=>'Organization','name'=>'Metom Design','url'=>home_url('/'),'logo'=>['@type'=>'ImageObject','url'=>get_template_directory_uri().'/assets/brand/metom_logo.png']],'inLanguage'=>get_bloginfo('language')];
        if(has_post_thumbnail()) $data['image']=[get_the_post_thumbnail_url(null,'full')];
    }elseif(is_singular('metom_project')){
        $data=['@context'=>'https://schema.org','@type'=>'CreativeWork','name'=>get_the_title(),'url'=>get_permalink(),'creator'=>['@type'=>'Organization','name'=>'Metom Design','url'=>home_url('/')]];
        $location=get_post_meta(get_the_ID(),'metom_location',true); if($location) $data['contentLocation']=$location;
        if(has_post_thumbnail()) $data['image']=[get_the_post_thumbnail_url(null,'full')];
    }elseif(is_singular('metom_service')){
        $data=['@context'=>'https://schema.org','@type'=>'Service','name'=>get_the_title(),'url'=>get_permalink(),'provider'=>['@type'=>'InteriorDesigner','name'=>'Metom Design','url'=>home_url('/')],'areaServed'=>['Malang','Batu','Jawa Timur']];
    }
    if($data) echo '<script type="application/ld+json">'.wp_json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>';
}
add_action('wp_head','metom_schema_output',20);


/**
 * Lightweight SEO fallbacks when no dedicated SEO plugin is active.
 * Yoast/Rank Math/AIOSEO take precedence to avoid duplicate metadata.
 */
function metom_social_meta_output() {
    if (metom_has_seo_plugin() || !is_singular('post')) return;
    $title=wp_strip_all_tags(get_the_title());
    $description=has_excerpt() ? wp_strip_all_tags(get_the_excerpt()) : wp_trim_words(wp_strip_all_tags(get_the_content()),28,'…');
    $url=get_permalink();
    $image=has_post_thumbnail() ? get_the_post_thumbnail_url(null,'full') : get_template_directory_uri().'/assets/brand/metom_logo.png';
    echo "\n".'<meta name="author" content="'.esc_attr(get_the_author()).'">';
    echo "\n".'<meta property="og:type" content="article">';
    echo "\n".'<meta property="og:locale" content="'.esc_attr(str_replace('-','_',get_bloginfo('language'))).'">';
    echo "\n".'<meta property="og:site_name" content="'.esc_attr(get_bloginfo('name')).'">';
    echo "\n".'<meta property="og:title" content="'.esc_attr($title).'">';
    echo "\n".'<meta property="og:description" content="'.esc_attr($description).'">';
    echo "\n".'<meta property="og:url" content="'.esc_url($url).'">';
    echo "\n".'<meta property="og:image" content="'.esc_url($image).'">';
    echo "\n".'<meta property="article:published_time" content="'.esc_attr(get_the_date(DATE_W3C)).'">';
    echo "\n".'<meta property="article:modified_time" content="'.esc_attr(get_the_modified_date(DATE_W3C)).'">';
    echo "\n".'<meta name="twitter:card" content="summary_large_image">';
    echo "\n".'<meta name="twitter:title" content="'.esc_attr($title).'">';
    echo "\n".'<meta name="twitter:description" content="'.esc_attr($description).'">';
    echo "\n".'<meta name="twitter:image" content="'.esc_url($image).'">';
}
add_action('wp_head','metom_social_meta_output',15);

function metom_breadcrumb_schema_output() {
    if (metom_has_seo_plugin() || !is_singular('post')) return;
    $blog_url=home_url('/blog/');
    $data=[
        '@context'=>'https://schema.org',
        '@type'=>'BreadcrumbList',
        'itemListElement'=>[
            ['@type'=>'ListItem','position'=>1,'name'=>'Home','item'=>home_url('/')],
            ['@type'=>'ListItem','position'=>2,'name'=>'Blog Interior','item'=>$blog_url],
            ['@type'=>'ListItem','position'=>3,'name'=>get_the_title(),'item'=>get_permalink()],
        ],
    ];
    echo '<script type="application/ld+json">'.wp_json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>';
}
add_action('wp_head','metom_breadcrumb_schema_output',21);

function metom_share_buttons($position='top') {
    $class='metom-share'.($position==='bottom'?' metom-share--bottom':'');
    ob_start(); ?>
    <div class="<?php echo esc_attr($class); ?>" aria-label="<?php esc_attr_e('Bagikan artikel','metom'); ?>">
      <span class="metom-share__label"><?php esc_html_e('Share','metom'); ?></span>
      <a class="metom-share__icon metom-share__icon--facebook" data-share="facebook" href="#" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.6 21v-8h2.8l.4-3.1h-3.2V8c0-.9.3-1.5 1.6-1.5H17V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.5V13h2.8v8h3.3Z"/></svg></a>
      <a class="metom-share__icon metom-share__icon--x" data-share="x" href="#" aria-label="X" title="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4h4.2l3.9 5.2L17 4h2.3l-5.6 6.9L20 20h-4.2l-4.3-5.8L6.7 20H4.4l6-7.5L4.5 4Zm3 1.7H6.9l9.7 12.6h.7L7.5 5.7Z"/></svg></a>
      <button class="metom-share__icon metom-share__icon--instagram" type="button" data-share="instagram" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 2.8h9A4.7 4.7 0 0 1 21.2 7.5v9a4.7 4.7 0 0 1-4.7 4.7h-9a4.7 4.7 0 0 1-4.7-4.7v-9a4.7 4.7 0 0 1 4.7-4.7Zm4.5 4A5.2 5.2 0 1 0 12 17.2 5.2 5.2 0 0 0 12 6.8Zm0 2A3.2 3.2 0 1 1 8.8 12 3.2 3.2 0 0 1 12 8.8Zm5.5-3.1a1.2 1.2 0 1 0 1.2 1.2 1.2 1.2 0 0 0-1.2-1.2Z"/></svg></button>
      <button class="metom-share__icon metom-share__icon--tiktok" type="button" data-share="tiktok" aria-label="TikTok" title="TikTok"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.4 3h3a5.8 5.8 0 0 0 3.6 3.6v3a9.1 9.1 0 0 1-3.6-1v6.6a6.2 6.2 0 1 1-5.4-6.1v3.1a3.2 3.2 0 1 0 2.4 3V3Z"/></svg></button>
      <a class="metom-share__icon metom-share__icon--linkedin" data-share="linkedin" href="#" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.4 8.2H2.3V21h3.1V8.2ZM3.8 3A1.8 1.8 0 1 0 3.8 6.6 1.8 1.8 0 0 0 3.8 3ZM21.7 13.7c0-3.9-2.1-5.7-4.9-5.7a4.2 4.2 0 0 0-3.8 2.1V8.2H9.9V21H13v-6.3c0-1.7.3-3.3 2.4-3.3s2.1 1.9 2.1 3.4V21h3.1v-7.3Z"/></svg></a>
      <button class="metom-share__icon metom-share__icon--copy" type="button" data-share="copy" aria-label="<?php esc_attr_e('Copy Link','metom'); ?>" title="Copy Link"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg></button>
      <span class="metom-share__status" aria-live="polite"></span>
    </div>
    <?php return ob_get_clean();
}
