import 'package:flutter/material.dart';

class MenuScreen extends StatelessWidget {
  const MenuScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notre Menu'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: ListView(
        children: [
          _buildMenuSection(
            context,
            'Entrées',
            [
              _MenuItem(
                name: 'Salade de chèvre chaud',
                description: 'Mesclun, toast de chèvre, miel, noix',
                price: '9,50 €',
              ),
              _MenuItem(
                name: 'Carpaccio de saumon',
                description: 'Saumon frais, huile d\'olive, citron',
                price: '12,00 €',
              ),
              _MenuItem(
                name: 'Velouté de saison',
                description: 'Légumes de saison, crème fraîche',
                price: '8,00 €',
              ),
            ],
          ),
          _buildMenuSection(
            context,
            'Plats',
            [
              _MenuItem(
                name: 'Filet de dorade royale',
                description: 'Purée de patate douce, sauce vierge',
                price: '18,50 €',
              ),
              _MenuItem(
                name: 'Suprême de volaille fermière',
                description: 'Risotto aux champignons, jus de volaille',
                price: '16,00 €',
              ),
              _MenuItem(
                name: 'Pavé de bœuf grillé',
                description: 'Pommes grenailles, sauce béarnaise',
                price: '22,00 €',
              ),
              _MenuItem(
                name: 'Risotto aux légumes de saison',
                description: 'Asperges, petits pois, parmesan',
                price: '14,50 €',
              ),
            ],
          ),
          _buildMenuSection(
            context,
            'Desserts',
            [
              _MenuItem(
                name: 'Tiramisu maison',
                description: 'Biscuit, mascarpone, café, cacao',
                price: '7,00 €',
              ),
              _MenuItem(
                name: 'Fondant au chocolat',
                description: 'Chocolat noir, cœur coulant, glace vanille',
                price: '8,50 €',
              ),
              _MenuItem(
                name: 'Assiette de fromages affinés',
                description: 'Sélection de trois fromages, mesclun',
                price: '9,00 €',
              ),
            ],
          ),
          _buildMenuSection(
            context,
            'Boissons',
            [
              _MenuItem(
                name: 'Eau minérale (50cl)',
                description: 'Plate ou gazeuse',
                price: '3,50 €',
              ),
              _MenuItem(
                name: 'Soda (33cl)',
                description: 'Cola, limonade, thé glacé',
                price: '4,00 €',
              ),
              _MenuItem(
                name: 'Verre de vin',
                description: 'Rouge, blanc ou rosé',
                price: '5,00 €',
              ),
            ],
          ),
          const SizedBox(height: 16.0),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/reservation');
              },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Réserver une table'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuSection(BuildContext context, String title, List<_MenuItem> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          color: Theme.of(context).colorScheme.surfaceVariant,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        ...items.map((item) => _buildMenuItem(item)).toList(),
      ],
    );
  }

  Widget _buildMenuItem(_MenuItem item) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Text(
              item.name,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
          Text(
            item.price,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
      subtitle: Padding(
        padding: const EdgeInsets.only(top: 4.0),
        child: Text(item.description),
      ),
    );
  }
}

class _MenuItem {
  final String name;
  final String description;
  final String price;

  _MenuItem({
    required this.name,
    required this.description,
    required this.price,
  });
}
