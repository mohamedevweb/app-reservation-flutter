class MenuItem {
  final String name;
  final String description;
  final String price;
  final String category;
  final bool available;

  MenuItem({
    required this.name,
    required this.description,
    required this.price,
    required this.category,
    this.available = true,
  });

  factory MenuItem.fromJson(Map<String, dynamic> json) {
    // Convertir les catégories techniques en catégories affichables
    String displayCategory = _mapCategoryToDisplay(json['category'] as String);

    return MenuItem(
      name: json['name'] as String,
      description: json['description'] as String,
      price: '${json['price'].toString()} €',
      category: displayCategory,
      available: json['available'] as bool? ?? true,
    );
  }

  // Conversion des catégories techniques en catégories affichables
  static String _mapCategoryToDisplay(String apiCategory) {
    // Map des catégories de l'API vers des noms plus conviviaux pour l'UI
    final Map<String, String> categoryMap = {
      'appetizer': 'Entrées',
      'main_course': 'Plats',
      'dessert': 'Desserts',
      'beverage': 'Boissons',
      'starter': 'Entrées',
      'soup': 'Soupes',
      'salad': 'Salades',
      'pizza': 'Pizzas',
      'pasta': 'Pâtes',
      'meat': 'Viandes',
      'fish': 'Poissons',
      'vegetarian': 'Végétarien',
      'vegan': 'Vegan',
    };

    return categoryMap[apiCategory] ?? apiCategory;
  }
}

class MenuCategory {
  final String name;
  final List<MenuItem> items;

  MenuCategory({required this.name, required this.items});
}
