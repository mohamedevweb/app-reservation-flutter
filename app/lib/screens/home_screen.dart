import 'package:flutter/material.dart';
import 'reservation_screen.dart';
import 'menu_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Le Jardin Gourmand'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image du restaurant
            ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Image.asset(
                'assets/images/image.png',
                height: 300,
                width: double.infinity,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    height: 200,
                    width: double.infinity,
                    color: Colors.grey[300],
                    child: const Center(child: Text('Image non disponible')),
                  );
                },
              ),
            ),
            const SizedBox(height: 24.0),

            // Titre et description
            const Text(
              'Bienvenue au Jardin Gourmand',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12.0),
            const Text(
              'Restaurant moderne proposant une cuisine franco-méditerranéenne dans un cadre végétalisé et cosy.',
              style: TextStyle(fontSize: 16.0),
            ),
            const SizedBox(height: 24.0),

            // Boutons d'action
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const MenuScreen())
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                ),
                child: const Text('Découvrir notre carte'),
              ),
            ),
            const SizedBox(height: 12.0),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ReservationScreen())
                  );
                },
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16.0),
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Colors.white,
                ),
                child: const Text('Réserver une table'),
              ),
            ),
            const SizedBox(height: 24.0),

            // Informations du restaurant
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Horaires d\'ouverture',
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8.0),
                    Text('Lundi - Vendredi: 12h00 - 14h30, 19h00 - 22h30'),
                    Text('Samedi - Dimanche: 12h00 - 15h00, 19h00 - 23h00'),
                    SizedBox(height: 16.0),
                    Text(
                      'Contact',
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8.0),
                    Text('Téléphone: 01 23 45 67 89'),
                    Text('Email: contact@jardingourmand.fr'),
                    Text('Adresse: 123 Rue de la Gastronomie, 75000 Paris'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
