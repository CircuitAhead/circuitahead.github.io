"""Regression checks for adding app and game products without publishing fixtures."""
from copy import deepcopy
from html.parser import HTMLParser
from pathlib import Path
import importlib.util
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('catalog_builder', ROOT/'scripts/build-catalog.py')
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)

class Elements(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.feed(source)
    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.app = {
            'id':'test-app', 'name':'Test App', 'kind':'app', 'status':'development',
            'platforms':['Android'], 'url':'/test-app/', 'support_url':'/test-app/support/',
            'privacy_url':'/test-app/privacy/', 'featured':True,
            'summary':{'en':'Test-only app entry.','it':'Voce app usata soltanto nei test.'},
            'icon':{'src':'/assets/favicon.png','width':320,'height':320}
        }
        self.products = [self.app]
        self.game = deepcopy(self.app)
        self.game.update(id='test-game', name='Test Game', kind='game', platforms=['Windows', 'Web'], url='/test-game/', support_url='/test-game/support/', privacy_url='/test-game/privacy/', featured=False)
        self.game['summary'] = {'en':'Test-only game entry.','it':'Voce gioco usata soltanto nei test.'}
        self.game['preview'] = {'src':'/assets/circuitahead-logo.webp','width':724,'height':543,'shape':'landscape','alt':{'en':'Test artwork','it':'Immagine di prova'}}

    def test_app_and_game_are_listed_and_filterable(self):
        source = builder.render(self.products+[self.game])['products/index.html']
        tags = Elements(source).tags
        cards = [attrs for _, attrs in tags if 'data-catalog-product' in attrs]
        self.assertEqual([card['data-product-kind'] for card in cards], ['app','game'])
        self.assertEqual({attrs['data-product-filter'] for _, attrs in tags if 'data-product-filter' in attrs}, {'all','app','game'})
        self.assertIn('href="/test-game/"', source)
        self.assertIn('Windows', source)

    def test_support_and_privacy_use_each_products_own_links(self):
        pages = builder.render(self.products+[self.game])
        self.assertIn('href="/test-game/support/"', pages['help/index.html'])
        self.assertIn('href="/test-game/privacy/"', pages['legal/index.html'])
        self.assertIn('href="/test-app/support/"', pages['help/index.html'])
        self.assertIn('href="/test-app/privacy/"', pages['legal/index.html'])

    def test_featured_landscape_game_and_secondary_app(self):
        products = deepcopy(self.products)
        for product in products:
            product['featured'] = False
        self.game['featured'] = True
        source = builder.home_products(products+[self.game])
        self.assertIn('data-featured-product="test-game"', source)
        self.assertIn('data-preview-shape="landscape"', source)
        self.assertIn('data-product-id="test-app"', source)

    def test_tool_can_be_listed_without_displacing_featured_app(self):
        tool = deepcopy(self.game)
        tool.update(id='test-tool', name='Test Tool', kind='tool', home_visible=False)
        products = self.products + [tool]
        source = builder.render(products)['products/index.html']
        tags = Elements(source).tags
        self.assertEqual({attrs['data-product-filter'] for _, attrs in tags if 'data-product-filter' in attrs}, {'all', 'app', 'tool'})
        self.assertIn('data-product-id="test-tool"', source)
        home = builder.home_products(products)
        self.assertIn('data-featured-product="test-app"', home)
        self.assertNotIn('test-tool', home)

    def test_catalog_preview_keeps_landscape_image_and_product_link(self):
        self.game['catalog_preview'] = self.game['preview']
        tags = Elements(builder.card(self.game)).tags
        self.assertTrue(any(tag == 'a' and attrs.get('class') == 'catalog-preview' and attrs.get('href') == '/test-game/' for tag, attrs in tags))
        self.assertTrue(any(tag == 'img' and attrs.get('src') == '/assets/circuitahead-logo.webp' and attrs.get('width') == '724' and attrs.get('height') == '543' for tag, attrs in tags))

if __name__ == '__main__':
    unittest.main()
