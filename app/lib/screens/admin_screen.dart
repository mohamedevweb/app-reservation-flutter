import 'package:flutter/material.dart';

class AdminScreen extends StatefulWidget {
  const AdminScreen({super.key});

  @override
  State<AdminScreen> createState() => _AdminScreenState();
}

class _AdminScreenState extends State<AdminScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  bool _isAuthenticated = false;
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  // Données fictives pour simulation
  final List<Map<String, dynamic>> _reservations = [
    {
      'id': 'RES-123456',
      'name': 'Pierre Dupont',
      'date': DateTime.now().add(const Duration(days: 1)),
      'time': const TimeOfDay(hour: 12, minute: 30),
      'guests': 4,
      'phone': '06 12 34 56 78',
      'email': 'pierre.dupont@example.com',
      'status': 'confirmée'
    },
    {
      'id': 'RES-123457',
      'name': 'Marie Martin',
      'date': DateTime.now(),
      'time': const TimeOfDay(hour: 20, minute: 0),
      'guests': 2,
      'phone': '06 23 45 67 89',
      'email': 'marie.martin@example.com',
      'status': 'confirmée'
    },
    {
      'id': 'RES-123458',
      'name': 'Jean Dubois',
      'date': DateTime.now().add(const Duration(days: 2)),
      'time': const TimeOfDay(hour: 13, minute: 0),
      'guests': 6,
      'phone': '06 34 56 78 90',
      'email': 'jean.dubois@example.com',
      'status': 'en attente'
    },
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _login() {
    // Simuler une authentification simple
    if (_usernameController.text == 'admin' && _passwordController.text == 'password') {
      setState(() {
        _isAuthenticated = true;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Identifiants incorrects'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _logout() {
    setState(() {
      _isAuthenticated = false;
    });
  }

  void _updateReservationStatus(int index, String status) {
    setState(() {
      _reservations[index]['status'] = status;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Réservation ${_reservations[index]['id']} marquée comme $status'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!_isAuthenticated) {
      return _buildLoginScreen();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Administration'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _logout,
            tooltip: 'Déconnexion',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Aujourd\'hui'),
            Tab(text: 'À venir'),
            Tab(text: 'Paramètres'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildTodayReservations(),
          _buildUpcomingReservations(),
          _buildSettings(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Action pour ajouter une réservation manuellement
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Fonctionnalité à implémenter')),
          );
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildLoginScreen() {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Administration - Connexion'),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: Center(
        child: Card(
          margin: const EdgeInsets.all(16.0),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Connexion à l\'espace d\'administration',
                  style: TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16.0),
                TextField(
                  controller: _usernameController,
                  decoration: const InputDecoration(
                    labelText: 'Nom d\'utilisateur',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16.0),
                TextField(
                  controller: _passwordController,
                  decoration: const InputDecoration(
                    labelText: 'Mot de passe',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true,
                ),
                const SizedBox(height: 16.0),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _login,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16.0),
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Se connecter'),
                  ),
                ),
                const SizedBox(height: 8.0),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/');
                  },
                  child: const Text('Retour à l\'accueil'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTodayReservations() {
    // Filtrer les réservations du jour
    final todayReservations = _reservations.where((res) {
      final DateTime date = res['date'] as DateTime;
      final DateTime today = DateTime.now();
      return date.year == today.year && date.month == today.month && date.day == today.day;
    }).toList();

    if (todayReservations.isEmpty) {
      return const Center(
        child: Text('Aucune réservation pour aujourd\'hui'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: todayReservations.length,
      itemBuilder: (context, index) {
        final reservation = todayReservations[index];
        final TimeOfDay time = reservation['time'] as TimeOfDay;
        final int originalIndex = _reservations.indexOf(reservation);

        return Card(
          elevation: 2.0,
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${time.hour}h${time.minute.toString().padLeft(2, '0')} - ${reservation['guests']} pers.',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16.0,
                      ),
                    ),
                    Chip(
                      label: Text(reservation['status']),
                      backgroundColor: reservation['status'] == 'confirmée'
                          ? Colors.green[100]
                          : Colors.orange[100],
                    ),
                  ],
                ),
                const SizedBox(height: 8.0),
                Text('Client: ${reservation['name']}'),
                Text('Téléphone: ${reservation['phone']}'),
                Text('Référence: ${reservation['id']}'),
                const SizedBox(height: 8.0),
                ButtonBar(
                  children: [
                    OutlinedButton(
                      onPressed: () => _updateReservationStatus(originalIndex, 'annulée'),
                      child: const Text('Annuler'),
                    ),
                    ElevatedButton(
                      onPressed: () => _updateReservationStatus(originalIndex, 'confirmée'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Confirmer'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildUpcomingReservations() {
    // Filtrer les réservations à venir
    final upcomingReservations = _reservations.where((res) {
      final DateTime date = res['date'] as DateTime;
      final DateTime today = DateTime.now();

      // Exclure les réservations d'aujourd'hui et du passé
      return date.isAfter(DateTime(today.year, today.month, today.day, 23, 59));
    }).toList();

    if (upcomingReservations.isEmpty) {
      return const Center(
        child: Text('Aucune réservation à venir'),
      );
    }

    // Trier par date
    upcomingReservations.sort((a, b) {
      final DateTime dateA = a['date'] as DateTime;
      final DateTime dateB = b['date'] as DateTime;
      return dateA.compareTo(dateB);
    });

    return ListView.builder(
      padding: const EdgeInsets.all(8.0),
      itemCount: upcomingReservations.length,
      itemBuilder: (context, index) {
        final reservation = upcomingReservations[index];
        final DateTime date = reservation['date'] as DateTime;
        final TimeOfDay time = reservation['time'] as TimeOfDay;
        final int originalIndex = _reservations.indexOf(reservation);

        return Card(
          elevation: 2.0,
          margin: const EdgeInsets.symmetric(vertical: 8.0),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${date.day}/${date.month} - ${time.hour}h${time.minute.toString().padLeft(2, '0')} - ${reservation['guests']} pers.',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16.0,
                      ),
                    ),
                    Chip(
                      label: Text(reservation['status']),
                      backgroundColor: reservation['status'] == 'confirmée'
                          ? Colors.green[100]
                          : Colors.orange[100],
                    ),
                  ],
                ),
                const SizedBox(height: 8.0),
                Text('Client: ${reservation['name']}'),
                Text('Téléphone: ${reservation['phone']}'),
                Text('Référence: ${reservation['id']}'),
                const SizedBox(height: 8.0),
                ButtonBar(
                  children: [
                    OutlinedButton(
                      onPressed: () => _updateReservationStatus(originalIndex, 'annulée'),
                      child: const Text('Annuler'),
                    ),
                    ElevatedButton(
                      onPressed: () => _updateReservationStatus(originalIndex, 'confirmée'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Confirmer'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSettings() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Paramètres du restaurant',
            style: TextStyle(
              fontSize: 20.0,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16.0),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Horaires d\'ouverture',
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  const Text('Fonctionnalité à implémenter: modifier les horaires d\'ouverture'),
                  const SizedBox(height: 16.0),
                  const Text(
                    'Capacité du restaurant',
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  const Text('Fonctionnalité à implémenter: modifier la capacité du restaurant'),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16.0),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Gestion des menus',
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  const Text('Fonctionnalité à implémenter: modifier les menus'),
                  const SizedBox(height: 16.0),
                  ElevatedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Fonctionnalité à implémenter')),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Modifier les plats du jour'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
