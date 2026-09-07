import 'package:flutter/material.dart';
import '../models/line_analysis.dart';

class AnalysisSection extends StatelessWidget {
  final List<LineAnalysis> analyses;
  final String currentLineText;

  const AnalysisSection({
    super.key,
    required this.analyses,
    required this.currentLineText,
  });

  @override
  Widget build(BuildContext context) {
    final words = analyses.where((a) => a.isWord).toList();
    final grammar = analyses.where((a) => a.isGrammar).toList();
    final expressions = analyses.where((a) => a.isExpression).toList();

    if (analyses.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.info_outline,
              size: 48,
              color: Theme.of(context).colorScheme.outline,
            ),
            const SizedBox(height: 16),
            Text(
              '这句话暂无语言分析',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Theme.of(context).colorScheme.onSurfaceVariant,
                  ),
            ),
          ],
        ),
      );
    }

    return DefaultTabController(
      length: 3,
      child: Column(
        children: [
          TabBar(
            tabs: [
              Tab(text: '单词 (${words.length})'),
              Tab(text: '表达 (${expressions.length})'),
              Tab(text: '语法 (${grammar.length})'),
            ],
          ),
          Expanded(
            child: TabBarView(
              children: [
                _buildAnalysisList(context, words),
                _buildAnalysisList(context, expressions),
                _buildAnalysisList(context, grammar),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnalysisList(BuildContext context, List<LineAnalysis> items) {
    if (items.isEmpty) {
      return Center(
        child: Text(
          '暂无内容',
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Theme.of(context).colorScheme.onSurfaceVariant,
              ),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (context, index) {
        return _buildAnalysisCard(context, items[index]);
      },
    );
  }

  Widget _buildAnalysisCard(BuildContext context, LineAnalysis analysis) {
    final color = analysis.isWord
        ? Colors.blue
        : analysis.isGrammar
            ? Colors.green
            : Colors.orange;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          // TODO: 播放单词发音
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('播放"${analysis.term}"的发音')),
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      analysis.kind,
                      style: TextStyle(
                        color: color,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      analysis.term,
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                    ),
                  ),
                  if (analysis.isWord)
                    Icon(
                      Icons.volume_up,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                analysis.meaning,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              if (analysis.note != null) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surfaceVariant,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.lightbulb_outline,
                        size: 16,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          analysis.note!,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
