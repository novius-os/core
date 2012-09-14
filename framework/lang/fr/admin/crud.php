<?php
/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */

#  +'\w+' => __\('(.+)'\),
#
#  +'.+' => __\((['"])(.+)['"]\),
# $1$2$1 => $1$2$1,

return array(
    'successfully added' => 'Item ajoutée.',
    'successfully saved' => 'Item enregistré.',
    'successfully deleted' => 'Item supprimé!',
    'you are about to delete, confim' => 'Vous êtes sur le point de supprimer l\'item <span style="font-weight: bold;">":title"</span>. Êtes-vous sûr ?',
    'you are about to delete' => 'Vous êtes sur le point de supprimer l\'item<span style="font-weight: bold;">":title"</span>.',
    'exists in multiple lang' => 'Cet item existe dans <strong>{count} langues</strong>.',
    'delete in the following languages' => 'Supprimer cet item dans les langues suivantes:',
    'item has 1 sub-item' => 'Cet item a <strong>1 enfant</strong>.',
    'item has multiple sub-items' => 'Cet item a <strong>{count} enfants</strong>.',
    'confirm deletion, enter number' => 'Pour confirmer la suppression, vous devez entrer ce nombre dans le champ ci-dessous',
    'yes delete sub-items' => 'Oui, je veux supprimer cet items, ainsi que ses {count} enfants.',
    'item deleted' => 'Cet item a été supprimée.',
    'not found' => 'Item non trouvée',
    'error added in lang not parent' => 'Cet item ne peut pas être ajouté en {lang} parce que son {parent} n\'existe pas encore dans cette langue.',
    'error added in lang' => 'Cet item ne peut pas être ajouté en {lang}.',
    'item inexistent in lang yet' => 'Cet item n\'a pas encore été ajoutée en {lang}.',
    'add an item in lang' => 'Ajouter un item en {lang}',
    'delete an item' => 'Supprimer un item',
    'confirm deletion ok' => 'Confirmer la suppression',
    'confirm deletion or' => 'ou',
    'confirm deletion cancel' => 'Annuler',
    'confirm deletion wrong_confirmation' => 'Mauvaise confirmation',


    'Edit' => 'Modifier',
    'Delete' => 'Supprimer',
    'Visualise' => 'Visualiser',
    'Save' => 'Enregistrer',
    'Add' => 'Ajouter',
    'or' => 'ou',
    'Cancel' => 'Annuler',

    'Share' => 'Partager',
    'Translate in {lang}' => 'Traduire en {lang}',
    'Edit in {lang}' => 'Modifier en {lang}',
    'Edit in {lang}' => 'Modifier en {lang}',
);
