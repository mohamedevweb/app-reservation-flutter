import 'package:flutter/material.dart';
import '../models/menu_item.dart';
import '../services/api_service.dart';

class MenuScreen extends StatefulWidget {
  const MenuScreen({super.key});

  @override
  State<MenuScreen> createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  late Future<List<MenuItem>> _menuItemsFuture;
  bool _isLoading = true;
  String? _errorMessage;
  List<MenuCategory> _categories = [];

  @override
  void initState() {
    super.initState();
    _loadMenuItems();
  }

  Future<void> _loadMenuItems() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      _menuItemsFuture = ApiService.getMenuItems();
      final menuItems = await _menuItemsFuture;

      // Filtrer pour n'afficher que les éléments disponibles
      final availableMenuItems =
          menuItems.where((item) => item.available).toList();

      if (availableMenuItems.isEmpty) {
        setState(() {
          _isLoading = false;
          _categories = [];
        });
      } else {
        _categories = ApiService.groupMenuItemsByCategory(availableMenuItems);
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Erreur lors du chargement du menu: $e');
      setState(() {
        _isLoading = false;
        _errorMessage = 'Erreur lors du chargement du menu: $e';
      });
    }
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 60),
            const SizedBox(height: 16),
            Text(
              _errorMessage ?? 'Une erreur est survenue',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _loadMenuItems,
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyMenuWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.restaurant_menu, size: 60, color: Colors.grey),
          const SizedBox(height: 16),
          const Text(
            'Aucun plat disponible pour le moment',
            style: TextStyle(fontSize: 18),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadMenuItems,
            child: const Text('Actualiser'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notre Menu'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMenuItems,
            tooltip: 'Actualiser le menu',
          ),
        ],
      ),
      body:
          _isLoading
              ? const Center(child: CircularProgressIndicator())
              : _errorMessage != null
              ? _buildErrorWidget()
              : _categories.isEmpty
              ? _buildEmptyMenuWidget()
              : ListView(
                children: [
                  ..._categories
                      .map(
                        (category) => _buildMenuSection(
                          context,
                          category.name,
                          category.items
                              .map(
                                (item) => _MenuItem(
                                  name: item.name,
                                  description: item.description,
                                  price: item.price,
                                ),
                              )
                              .toList(),
                        ),
                      )
                      .toList(),
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

  Widget _buildMenuSection(
    BuildContext context,
    String title,
    List<_MenuItem> items,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          color: Theme.of(context).colorScheme.surfaceVariant,
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
          child: Text(
            title,
            style: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
          ),
        ),
        ...items.map((item) => _buildMenuItem(item)).toList(),
      ],
    );
  }

  Widget _buildMenuItem(_MenuItem item) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 16.0,
        vertical: 8.0,
      ),
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
          Text(item.price, style: const TextStyle(fontWeight: FontWeight.bold)),
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
