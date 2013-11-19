<?php
  require_once('../lib/php/class.HTMLpage.php');

  //$bootstrapPath = '../lib/bootstrap.3/dist/';
    $bootstrapPath = '../lib/bootstrap/';


  // page generation starts here
  $page = HTMLpage::getInstance();
  $page->startHTML();
  $page->startHead('Nanigans Homework');
  $page->meta('http-equiv', 'Content-Type', 'text/html;charset=iso-8859-1');
  $page->meta('name', 'viewport', 'width=device-width,initial-scale=1');
  $page->includeCSS( $bootstrapPath . 'css/bootstrap.min.css');
  $page->endHead();
  $page->startBody();

  $page->bufferOut(); // output the page so far and reset the buffer
?>

<style type="text/css">
  body {
    padding-top: 40px;
    padding-botttom: 30px;
  }
  .sidebar-nav  {
    padding: 9px;
  }
</style>


<div class="container">
  <div class="row">
    <div class="span12" id="heading">
      <p><h4>Retrieve two files; parse key/value pairs; sum, sort and display key/value pairs</h4>
    </div>    <!-- end of header div -->
  </div>      <!-- end of row -->
  <div class="row">
    <div class="span4">
      <div class="well sidebar-nav" id="">
      <!-- menu -->
        <p style="text-align:center;"><a class="btn btn-info" id="mergeFiles" title="process the files"  href="#">Do It Now!</a>
          &nbsp;&nbsp;&nbsp;
           <a class="btn btn-primary" id="mergeFiles2" title="process the files using Deferred"  href="#">Do It Deferred!</a></p>
       <p style="text-align:center;"> <a class="btn btn-warning" id="viewFiles" href="#" title="display the data files"> Display File Data </a>
          &nbsp;
        <a class="btn" id="viewInstructions" href="#" title="view original instructions"> Instructions </a> </p>

        <div  id="menu"></div>
      </div>
    </div>    <!-- end of menu div -->

    <div class="span8" id="main">
    <!-- body -->

    </div>    <!-- end of content div -->
  </div>

</div>

  <footer>
    <p></p>
  </footer>


<? // end of body and HTML document

  $page->includeJS('http://code.jquery.com/jquery-latest.min.js');
//  $page->includeJS( $bootstrapPath . 'js/bootstrap.min.js');

  $page->includeJS('homework.js');


  $page->endBody();
  $page->endHTML();
  $page->bufferOut();
?>
