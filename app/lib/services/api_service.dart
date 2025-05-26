import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/http.dart' as http;
import '../models/menu_item.dart';

class ApiService {
  // L'URL de base de votre API
  static String get baseUrl {
    // Si c'est une application web, on utilise l'URL relative pour éviter les problèmes CORS
    if (kIsWeb) {
      return '/api'; // Ceci nécessite une configuration de proxy dans le serveur web
    }
    // Pour les applications mobiles/desktop
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3000'; // Spécial pour Android (émulateur)
    }
    return 'http://localhost:3000';
  }

  // Méthode pour récupérer les menus
  static Future<List<MenuItem>> getMenuItems() async {
    try {
      // Pour débogage
      print('Fetching menu from: ${Uri.parse('$baseUrl/menu')}');

      // Ajouter des headers pour aider avec CORS
      final headers = {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      };

      final response = await http.get(
        Uri.parse('$baseUrl/menu'),
        headers: headers,
      );

      // Pour débogage
      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);

        // La réponse est une structure paginée avec un champ 'items'
        if (responseData.containsKey('items')) {
          final List<dynamic> items = responseData['items'];
          return items.map((item) => MenuItem.fromJson(item)).toList();
        } else {
          // Fallback en cas de changement de format
          if (responseData is List) {
            return (responseData as List)
                .map((item) => MenuItem.fromJson(item))
                .toList();
          } else {
            throw Exception('Format de réponse inattendu');
          }
        }
      } else {
        throw Exception('Échec de chargement du menu: ${response.statusCode}');
      }
    } catch (e) {
      print('Exception détaillée: $e');

      // Données de secours pour le développement en cas d'erreur CORS
      if (kIsWeb) {
        print(
          'Utilisation de données de secours pour le web en cas de problème CORS',
        );
        return _getFallbackMenuItems();
      }

      throw Exception('Erreur lors de la récupération du menu: $e');
    }
  }

  // Données de secours pour le développement
  static List<MenuItem> _getFallbackMenuItems() {
    final String jsonData = '''
    [
      {
        "id": 1,
        "name": "Salade de chèvre chaud",
        "description": "Mesclun, toast de chèvre, miel, noix",
        "price": 9.50,
        "category": "starter",
        "available": true
      },
      {
        "id": 2,
        "name": "Carpaccio de saumon",
        "description": "Saumon frais, huile d'olive, citron",
        "price": 12.00,
        "category": "starter",
        "available": true
      },
      {
        "id": 3,
        "name": "Filet de dorade royale",
        "description": "Purée de patate douce, sauce vierge",
        "price": 18.50,
        "category": "main_course",
        "available": true
      },
      {
        "id": 4,
        "name": "Tiramisu maison",
        "description": "Biscuit, mascarpone, café, cacao",
        "price": 7.00,
        "category": "dessert",
        "available": true
      }
    ]
    ''';

    List<dynamic> items = json.decode(jsonData);
    return items.map((item) => MenuItem.fromJson(item)).toList();
  }

  // Groupe les éléments du menu par catégorie
  static List<MenuCategory> groupMenuItemsByCategory(List<MenuItem> items) {
    // Récupère les catégories uniques
    final categories = items.map((item) => item.category).toSet().toList();

    // Crée une liste de MenuCategory
    return categories.map((category) {
      return MenuCategory(
        name: category,
        items: items.where((item) => item.category == category).toList(),
      );
    }).toList();
  }
}
