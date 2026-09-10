<?php
get_header();

$projects = new WP_Query([
    'post_type' => 'metom_project',
    'posts_per_page' => 3,
    'post_status' => 'publish',
]);
$services = new WP_Query([
    'post_type' => 'metom_service',
    'posts_per_page' => 6,
    'post_status' => 'publish',
]);
$journal = new WP_Query([
    'post_type' => 'post',
    'posts_per_page' => 3,
    'post_status' => 'publish',
]);
?>
<main id="content">
<section class="metom-hero">
  <div class="metom-shell metom-hero__inner">
    <p class="metom-kicker">Interior Design · Build · Malang</p>
    <h1>Ruang yang dirancang dengan matang, dibangun dengan tepat.</h1>
    <p>Metom Design menangani desain interior dan pengerjaan untuk rumah, kitchen set, kantor, dan ruang komersial.</p>
    <a class="metom-button js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">Konsultasi Proyek</a>
  </div>
</section>

<section class="metom-clients" aria-labelledby="clients-title">
  <div class="metom-shell">
    <p class="metom-kicker">Klien</p>
    <h2 id="clients-title">Dipercaya brand dan institusi.</h2>
    <div class="metom-client-list" aria-label="Beberapa klien Metom Design">
      <span>AIA</span><span>Surabaya Patata</span><span>Charis National Academy</span><span>MNC Finance</span><span>AL IZZAH Leadership School</span><span>Malang Strudel</span>
    </div>
  </div>
</section>

<section class="metom-section" id="proyek">
  <div class="metom-shell">
    <div class="metom-section__head"><p class="metom-kicker">Proyek Pilihan</p><h2>Portfolio yang menunjukkan bagaimana ruang dirancang dan dikerjakan.</h2></div>
    <div class="metom-card-grid metom-card-grid--projects">
      <?php if ($projects->have_posts()) : while ($projects->have_posts()) : $projects->the_post(); ?>
        <article class="metom-card">
          <a href="<?php the_permalink(); ?>">
            <?php if (has_post_thumbnail()) { the_post_thumbnail('large', ['loading'=>'lazy']); } ?>
            <div class="metom-card__body">
              <p><?php echo esc_html(get_post_meta(get_the_ID(),'metom_location',true)); ?></p>
              <h3><?php the_title(); ?></h3>
              <?php if (has_excerpt()) : ?><div><?php the_excerpt(); ?></div><?php endif; ?>
            </div>
          </a>
        </article>
      <?php endwhile; wp_reset_postdata(); else : ?>
        <p>Project pilihan akan tampil setelah data portfolio client dimasukkan.</p>
      <?php endif; ?>
    </div>
  </div>
</section>

<section class="metom-section metom-section--alt" id="layanan">
  <div class="metom-shell">
    <div class="metom-section__head"><p class="metom-kicker">Layanan</p><h2>Desain, furnitur kustom, dan pengerjaan dalam satu proses.</h2></div>
    <div class="metom-card-grid">
      <?php if ($services->have_posts()) : while ($services->have_posts()) : $services->the_post(); ?>
        <article class="metom-service-card"><h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><?php the_excerpt(); ?></article>
      <?php endwhile; wp_reset_postdata(); else : ?>
        <article class="metom-service-card"><h3>Desain Interior</h3><p>Konsep ruang, layout, material, visualisasi, dan gambar kerja.</p></article>
        <article class="metom-service-card"><h3>Furnitur Kustom</h3><p>Kitchen set, kabinet, lemari, meja, dan built-in furniture.</p></article>
        <article class="metom-service-card"><h3>Design + Build</h3><p>Koordinasi desain sampai pengerjaan untuk hasil yang konsisten.</p></article>
      <?php endif; ?>
    </div>
  </div>
</section>

<section class="metom-section" id="tentang"><div class="metom-shell metom-two-col"><div><p class="metom-kicker">Metom Design</p><h2>Berbasis di Malang. Fokus pada ruang yang nyaman digunakan.</h2></div><div><p>Kami membantu dari kebutuhan awal, pengembangan desain, pemilihan material, produksi, sampai instalasi. Struktur WordPress baru dibuat supaya portfolio dan layanan dapat dikelola sebagai konten dinamis tanpa mengubah layout utama.</p></div></div></section>

<section class="metom-section metom-section--alt"><div class="metom-shell"><p class="metom-kicker">Interior di Malang</p><h2>Service pages dibangun sebagai landing page SEO, bukan artikel generik.</h2><div class="metom-card-grid"><article class="metom-service-card"><h3>Jasa Desain Interior Malang</h3><p>Page utama untuk kebutuhan desain interior hunian dan komersial.</p></article><article class="metom-service-card"><h3>Kitchen Set Malang</h3><p>Page transaksi yang diperkuat project real, material, proses, dan FAQ.</p></article><article class="metom-service-card"><h3>Interior Rumah Malang</h3><p>Landing page untuk kebutuhan residential dengan internal link ke case study.</p></article></div></div></section>

<section class="metom-section" id="proses"><div class="metom-shell"><p class="metom-kicker">Proses</p><h2>Alur kerja dari konsultasi sampai serah terima.</h2><ol class="metom-process"><li>Konsultasi</li><li>Survei</li><li>Desain</li><li>Penawaran</li><li>Produksi & Pengerjaan</li><li>Serah Terima</li></ol></div></section>

<section class="metom-section metom-section--alt" id="wawasan"><div class="metom-shell"><div class="metom-section__head"><p class="metom-kicker">Jurnal</p><h2>Konten yang membantu calon klien sebelum memulai proyek.</h2></div><div class="metom-card-grid">
<?php if ($journal->have_posts()) : while ($journal->have_posts()) : $journal->the_post(); ?><article class="metom-service-card"><p><?php echo esc_html(get_the_date()); ?></p><h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><?php the_excerpt(); ?></article><?php endwhile; wp_reset_postdata(); else : ?><p>Artikel SEO akan tampil di sini setelah content production dimulai.</p><?php endif; ?>
</div></div></section>

<section class="metom-cta"><div class="metom-shell"><p class="metom-kicker">Mulai Proyek</p><h2>Punya ruang yang ingin dirancang atau dibenahi?</h2><p>Ceritakan kebutuhan Anda dan kami bantu menentukan langkah awal.</p><a class="metom-button js-wa-track" href="<?php echo esc_url(metom_whatsapp_url()); ?>" target="_blank" rel="noopener">Konsultasi via WhatsApp</a></div></section>
</main>
<?php get_footer(); ?>
