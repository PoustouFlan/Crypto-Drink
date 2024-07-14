package org.cryptodrink.data.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "config")
@Data
public class ConfigModel {
    @Id
    private String key;
    private Integer value;
}
