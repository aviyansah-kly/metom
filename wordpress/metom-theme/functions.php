<?php
/**
 * Metom Design theme setup.
 */

if (!defined('ABSPATH')) {
    exit;
}

function metom_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
    add_theme_support('custom-logo');
    add_theme_support('responsive-embeds');

    register_nav_menus([
        'primary' => __('Primary Navigation', 'metom'),
        'footer'  => __('Footer Navigation', 'metom'),
    ]);
}
add_action('after_setup_theme', 'metom_setup');

function metom_assets() {
    wp_enqueue_style('metom-style', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'metom_assets');

function metom_register_content_types() {
    register_post_type('metom_project', [
        'labels' => [
            'name'          => __('Projects', 'metom'),
            'singular_name' => __('Project', 'metom'),
            'add_new_item'  => __('Add New Project', 'metom'),
            'edit_item'     => __('Edit Project', 'metom'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-format-gallery',
        'has_archive'  => 'proyek',
        'rewrite'      => ['slug' => 'proyek', 'with_front' => false],
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
    ]);

    register_taxonomy('project_category', ['metom_project'], [
        'labels' => [
            'name'          => __('Project Categories', 'metom'),
            'singular_name' => __('Project Category', 'metom'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'hierarchical' => true,
        'rewrite'      => ['slug' => 'kategori-proyek', 'with_front' => false],
    ]);

    register_post_type('metom_service', [
        'labels' => [
            'name'          => __('Services', 'metom'),
            'singular_name' => __('Service', 'metom'),
            'add_new_item'  => __('Add New Service', 'metom'),
            'edit_item'     => __('Edit Service', 'metom'),
        ],
        'public'       => true,
        'show_in_rest' => true,
        'menu_icon'    => 'dashicons-admin-tools',
        'has_archive'  => 'layanan',
        'rewrite'      => ['slug' => 'layanan', 'with_front' => false],
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
    ]);
}
add_action('init', 'metom_register_content_types');

/**
 * Register basic REST-visible project metadata.
 * ACF can later provide the editorial UI for these fields.
 */
function metom_register_meta_fields() {
    $project_fields = [
        'metom_location',
        'metom_year',
        'metom_scope',
        'metom_challenge',
        'metom_solution',
        'metom_materials',
        'metom_duration',
        'metom_testimonial',
    ];

    foreach ($project_fields as $field) {
        register_post_meta('metom_project', $field, [
            'type'              => 'string',
            'single'            => true,
            'show_in_rest'      => true,
            'sanitize_callback' => 'sanitize_textarea_field',
            'auth_callback'     => static function () {
                return current_user_can('edit_posts');
            },
        ]);
    }
}
add_action('init', 'metom_register_meta_fields');
