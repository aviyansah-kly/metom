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
    wp_add_inline_script('metom-tracking',"document.addEventListener('click',function(e){var a=e.target.closest('.js-wa-track');if(!a)return;if(typeof window.gtag==='function'){window.gtag('event','whatsapp_click',{event_category:'lead',link_url:a.href});}});");
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
    $project_fields=['metom_location','metom_year','metom_scope','metom_challenge','metom_solution','metom_materials','metom_duration','metom_testimonial'];
    foreach($project_fields as $field){
        register_post_meta('metom_project',$field,['type'=>'string','single'=>true,'show_in_rest'=>true,'sanitize_callback'=>'sanitize_textarea_field','auth_callback'=>static function(){return current_user_can('edit_posts');}]);
    }
}
add_action('init','metom_register_meta_fields');

function metom_project_meta_box() {
    add_meta_box('metom_project_details',__('Project Details','metom'),'metom_project_meta_box_html','metom_project','normal','high');
}
add_action('add_meta_boxes','metom_project_meta_box');

function metom_project_meta_box_html($post) {
    wp_nonce_field('metom_project_meta_save','metom_project_meta_nonce');
    $fields=[
        'metom_location'=>'Lokasi',
        'metom_year'=>'Tahun',
        'metom_scope'=>'Scope Pekerjaan',
        'metom_challenge'=>'Challenge',
        'metom_solution'=>'Solusi Metom',
        'metom_materials'=>'Material Utama',
        'metom_duration'=>'Durasi',
        'metom_testimonial'=>'Testimonial',
    ];
    echo '<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">';
    foreach($fields as $key=>$label){
        $value=get_post_meta($post->ID,$key,true);
        $wide=in_array($key,['metom_scope','metom_challenge','metom_solution','metom_testimonial'],true);
        echo '<p style="margin:0;'.($wide?'grid-column:1/-1':'').'">';
        echo '<label for="'.esc_attr($key).'" style="display:block;font-weight:600;margin-bottom:6px">'.esc_html($label).'</label>';
        if($wide){
            echo '<textarea style="width:100%;min-height:90px" id="'.esc_attr($key).'" name="'.esc_attr($key).'">'.esc_textarea($value).'</textarea>';
        }else{
            echo '<input style="width:100%" type="text" id="'.esc_attr($key).'" name="'.esc_attr($key).'" value="'.esc_attr($value).'">';
        }
        echo '</p>';
    }
    echo '</div><p style="margin-top:18px;color:#646970">Gunakan Featured Image sebagai cover project. Foto tambahan dapat dimasukkan ke editor sebagai gallery sampai sistem gallery khusus ditambahkan.</p>';
}

function metom_save_project_meta($post_id) {
    if(!isset($_POST['metom_project_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['metom_project_meta_nonce'])),'metom_project_meta_save')) return;
    if(defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if(!current_user_can('edit_post',$post_id)) return;
    $fields=['metom_location','metom_year','metom_scope','metom_challenge','metom_solution','metom_materials','metom_duration','metom_testimonial'];
    foreach($fields as $field){
        if(isset($_POST[$field])) update_post_meta($post_id,$field,sanitize_textarea_field(wp_unslash($_POST[$field])));
    }
}
add_action('save_post_metom_project','metom_save_project_meta');

function metom_admin_columns($columns) {
    $new=[];
    foreach($columns as $key=>$label){
        $new[$key]=$label;
        if($key==='title'){
            $new['metom_location']=__('Location','metom');
            $new['metom_year']=__('Year','metom');
        }
    }
    return $new;
}
add_filter('manage_metom_project_posts_columns','metom_admin_columns');
function metom_admin_column_content($column,$post_id){
    if(in_array($column,['metom_location','metom_year'],true)) echo esc_html(get_post_meta($post_id,$column,true));
}
add_action('manage_metom_project_posts_custom_column','metom_admin_column_content',10,2);

function metom_article_schema() {
    if(!is_singular('post')) return;
    $data=[
        '@context'=>'https://schema.org',
        '@type'=>'Article',
        'headline'=>get_the_title(),
        'datePublished'=>get_the_date(DATE_W3C),
        'dateModified'=>get_the_modified_date(DATE_W3C),
        'mainEntityOfPage'=>get_permalink(),
        'author'=>['@type'=>'Organization','name'=>'Metom Design'],
        'publisher'=>['@type'=>'Organization','name'=>'Metom Design','url'=>home_url('/')],
    ];
    if(has_post_thumbnail()) $data['image']=[get_the_post_thumbnail_url(null,'full')];
    echo '<script type="application/ld+json">'.wp_json_encode($data,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE).'</script>';
}
add_action('wp_head','metom_article_schema',20);
