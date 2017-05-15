<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

Nos\I18n::current_dictionary(array('nos::pagination'));

return array(
    'foundation6' => array(
        'wrapper'                 => '
            <nav>
                <ul class="pagination" role="navigation" aria-label="'.e(__('Pagination')).'">
                    {pagination}
                </ul>
            </nav>
        ',

        'first'                   => '<li class="pagination-first">{link}</li>',
        'first-marker'            => e(__('First')),
        'first-link'              => '<a href="{uri}" aria-label="'.e(__('First page')).'">{page}</a>',

        'first-inactive'          => '<li class="pagination-first disabled">{link}</li>',
        'first-inactive-link'     => '{page}',

        'previous'                => '<li class="pagination-previous">{link}</li>',
        'previous-marker'         => e(__('Previous')),
        'previous-link'           => '<a href="{uri}" rel="prev" aria-label="'.e(__('Previous page (page {page})')).'">{page}</a>',

        'previous-inactive'       => '<li class="pagination-previous disabled">{link}</li>',
        'previous-inactive-link'  => '{page}',

        'regular'                 => '<li>{link}</li>',
        'regular-link'            => '<a href="{uri}" aria-label="'.e(__('Page {page}')).'">{page}</a>',

        'active'                  => '<li class="current">{link}</li>',
        'active-link'             => '{page}',

        'next'                    => '<li class="pagination-next">{link}</li>',
        'next-marker'             => e(__('Next')),
        'next-link'               => '<a href="{uri}" rel="next" aria-label="'.e(__('Next page (page {page})')).'">{page}</a>',

        'next-inactive'           => '<li class="pagination-next disabled">{link}</li>',
        'next-inactive-link'      => '{page}',

        'last'                    => '<li class="pagination-last">{link}</li>',
        'last-marker'             => e(__('Last')),
        'last-link'               => '<a href="{uri}" aria-label="'.e(__('Last page (page {page})')).'">{page}</a>',

        'last-inactive'           => '<li class="pagination-last disabled">{link}</li>',
        'last-inactive-link'      => '{page}',
    ),
);
