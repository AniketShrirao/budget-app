import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addTransactionToDB, fetchTransactions } from "../features/transactionSlice";
import { TextField, Button, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import "./TransactionForm.scss";
import { Categories } from "../data/categories";
import { Types } from "../data/types";
import { categoryTypeMapping } from "../data/categoryTypeMapping";

const TransactionForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    date: "",
    category: "Other",
    description: "",
    amount: "",
    type: "Needs",
    important: false,
    recurrence: "None",
  });

  useEffect(() => {
    const today = moment().format("YYYY-MM-DD");
    setForm((prevForm) => ({ ...prevForm, date: today }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
      ...(name === "category" && { type: categoryTypeMapping[value] || "Needs" }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTransactionToDB({ id: uuidv4(), ...form, amount: Number(form.amount) }))
      .then(() => {
        dispatch(fetchTransactions());
      });
    setForm({
      date: "",
      category: "Other",
      description: "",
      amount: "",
      type: "Needs",
      important: false,
      recurrence: "None",
    });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <TextField label="Date" type="date" name="date" value={form.date} onChange={handleChange} required />
      <TextField label="Category" select name="category" value={form.category} onChange={handleChange} required>
        {Categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.title}>
            {cat.title}
          </MenuItem>
        ))}
      </TextField>
      <TextField name="description" label="Description" value={form.description} onChange={handleChange} />
      <TextField type="number" name="amount" label="Amount" value={form.amount} onChange={handleChange} required />
      <TextField label="Type" select name="type" value={form.type} onChange={handleChange} required>
        {Object.values(Types).map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>
      <FormControlLabel
        control={<Checkbox checked={form.important} onChange={() => setForm({ ...form, important: !form.important })} />}
        label="Important"
      />
      <TextField label="Recurrence" select name="recurrence" value={form.recurrence} onChange={handleChange}>
        {["None", "Monthly", "Quarterly", "Yearly"].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Add Transaction
      </Button>
    </form>
  );
};

export default TransactionForm;
