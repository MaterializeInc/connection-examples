#[derive(Debug, Clone)]
pub(crate) struct Update<T>
where
    T: std::hash::Hash + Eq,
{
    pub(crate) value: T,
    pub(crate) diff: i64,
}

pub(crate) struct State<T>
where
    T: std::hash::Hash + Eq,
{
    state: std::collections::HashMap<T, i64>,
    timestamp: i64,
    valid: bool,
    history: Option<Vec<Update<T>>>,
}

impl<T> State<T>
where
    T: std::hash::Hash + Eq + Clone,
{
    pub(crate) fn new(collect_history: bool) -> State<T> {
        State {
            state: std::collections::HashMap::new(),
            timestamp: 0,
            valid: true,
            history: if collect_history {
                Some(Vec::new())
            } else {
                None
            },
        }
    }

    pub fn get_state(&self) -> Vec<T> {
        let mut list: Vec<T> = Vec::new();

        for (key, value) in &self.state {
            for _ in 0..*value {
                list.push(key.clone());
            }
        }

        list
    }

    pub fn get_history(&self) -> Option<&Vec<Update<T>>> {
        self.history.as_ref()
    }

    fn validate(&self, timestamp: i64) -> Result<(), String> {
        if !self.valid {
            Err("Invalid state.".to_string())
        } else if timestamp < self.timestamp {
            eprintln!("Invalid timestamp.");
            // &mut self.valid = false;
            Err(format!(
                "Update with timestamp ({}) is lower than the last timestamp ({}). Invalid state.",
                timestamp, self.timestamp
            ))
        } else {
            Ok(())
        }
    }

    fn process(&mut self, update: Update<T>) {
        let update_clone = update.clone();
        let value = update.value;
        let diff = update.diff;
        let count = self.state.get(&value).map_or(diff, |&v| v + diff);

        if count <= 0 {
            self.state.remove(&value);
        } else {
            self.state.insert(value, count);
        }

        if let Some(history) = &mut self.history {
            history.push(update_clone);
        }
    }

    pub fn update(&mut self, updates: Vec<Update<T>>, timestamp: i64) -> Result<(), String> {
        if !updates.is_empty() {
            self.validate(timestamp)?;
            self.timestamp = timestamp;
            updates
                .iter()
                .for_each(|update| self.process(update.clone()));
        }
        Ok(())
    }
}
