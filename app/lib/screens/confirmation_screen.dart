import 'package:flutter/material.dart';

class ConfirmationScreen extends StatelessWidget {
  const ConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Récupérer les données de la réservation passées en arguments
    final Map<String, dynamic> reservationData =
        ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;

    final String name = reservationData['name'] as String;
    final String phone = reservationData['phone'] as String;
    final String email = reservationData['email'] as String;
    final DateTime date = reservationData['date'] as DateTime;
    final TimeOfDay time = reservationData['time'] as TimeOfDay;
    final int guests = reservationData['guests'] as int;

    // Générer un ID de réservation unique (simulé)
    final String reservationId = 'RES-${DateTime.now().millisecondsSinceEpoch.toString().substring(6)}';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirmation'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 80.0,
            ),
            const SizedBox(height: 20.0),
            const Text(
              'Réservation confirmée !',
              style: TextStyle(
                fontSize: 24.0,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8.0),
            Text(
              'Merci $name pour votre réservation',
              style: const TextStyle(fontSize: 16.0),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32.0),

            // Détails de la réservation
            Card(
              elevation: 4.0,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Text(
                      'Détails de la réservation',
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16.0),
                    _buildDetailRow('Numéro de réservation', reservationId),
                    _buildDetailRow('Date', '${date.day}/${date.month}/${date.year}'),
                    _buildDetailRow('Heure', '${time.hour.toString().padLeft(2, '0')}h${time.minute.toString().padLeft(2, '0')}'),
                    _buildDetailRow('Nombre de personnes', guests.toString()),
                    _buildDetailRow('Nom', name),
                    _buildDetailRow('Téléphone', phone),
                    _buildDetailRow('Email', email),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16.0),

            // Instructions
            const Card(
              elevation: 2.0,
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Informations importantes',
                      style: TextStyle(
                        fontSize: 16.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8.0),
                    Text('• Une confirmation a été envoyée à votre adresse email'),
                    Text('• Veuillez arriver 10 minutes avant l\'heure de votre réservation'),
                    Text('• Pour toute modification ou annulation, merci de nous contacter par téléphone au moins 2 heures à l\'avance'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32.0),

            // Boutons d'action
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false);
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                    ),
                    child: const Text('Retour à l\'accueil'),
                  ),
                ),
                const SizedBox(width: 16.0),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, '/menu');
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Voir le menu'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(value),
        ],
      ),
    );
  }
}
