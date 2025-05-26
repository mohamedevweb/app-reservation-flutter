import 'package:flutter/material.dart';
import 'screens/confirmation_screen.dart';
import 'screens/admin_screen.dart';
import 'navigation/main_navigation.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Le Jardin Gourmand',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.green),
        useMaterial3: true,
      ),
      home: const MainNavigation(),
      // Conserver uniquement les routes pour les écrans qui ne font pas partie de la navigation principale
      routes: {
        '/confirmation': (context) => const ConfirmationScreen(),
        '/admin': (context) => const AdminScreen(),
      },
    );
  }
}

